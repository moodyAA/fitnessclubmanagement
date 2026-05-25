from datetime import timedelta
from decimal import Decimal

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Client(models.Model):
    full_name = models.CharField('ФИО', max_length=255)
    passport_data = models.CharField('Паспортные данные', max_length=50)
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Email')
    birth_date = models.DateField('Дата рождения')
    address = models.CharField('Адрес', max_length=255)

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class Membership(models.Model):
    STATUS_ACTIVE = 'Активен'
    STATUS_ARCHIVED = 'Архив'
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Активен'),
        (STATUS_ARCHIVED, 'Архив'),
    ]

    name = models.CharField('Вид абонемента', max_length=255)
    description = models.TextField('Описание')
    duration_days = models.PositiveIntegerField('Срок в днях')
    base_price = models.DecimalField('Базовая стоимость', max_digits=10, decimal_places=2)
    sessions_count = models.PositiveIntegerField('Количество занятий')
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)

    class Meta:
        verbose_name = 'Абонемент'
        verbose_name_plural = 'Абонементы'
        ordering = ['name']

    def __str__(self):
        return self.name


class Contract(models.Model):
    number = models.CharField('Номер договора', max_length=50, unique=True)
    date = models.DateField('Дата договора')
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='contracts', verbose_name='Клиент')
    membership = models.ForeignKey(
        Membership, on_delete=models.PROTECT, related_name='contracts', verbose_name='Абонемент'
    )
    discount = models.PositiveIntegerField(
        'Скидка, %',
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    total_price = models.DecimalField('Итоговая стоимость', max_digits=10, decimal_places=2, editable=False)
    club_name = models.CharField('Название клуба', max_length=255, default='FitClub Краснодар')
    expiry_date = models.DateField('Срок действия', editable=False)

    class Meta:
        verbose_name = 'Договор'
        verbose_name_plural = 'Договоры'
        ordering = ['-date', '-id']

    def __str__(self):
        return self.number

    def save(self, *args, **kwargs):
        from django.utils.dateparse import parse_date

        if isinstance(self.date, str):
            self.date = parse_date(self.date)

        base = self.membership.base_price
        discount_amount = base * Decimal(self.discount) / Decimal(100)
        self.total_price = base - discount_amount
        self.expiry_date = self.date + timedelta(days=self.membership.duration_days)
        super().save(*args, **kwargs)


class Trainer(models.Model):
    CATEGORY_CHOICES = [
        ('Высшая', 'Высшая'),
        ('Первая', 'Первая'),
        ('Вторая', 'Вторая'),
    ]

    full_name = models.CharField('ФИО', max_length=255)
    specialization = models.CharField('Специализация', max_length=255)
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Email')
    experience_years = models.PositiveIntegerField('Стаж (лет)')
    category = models.CharField('Категория', max_length=20, choices=CATEGORY_CHOICES)

    class Meta:
        verbose_name = 'Тренер'
        verbose_name_plural = 'Тренеры'
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class Hall(models.Model):
    name = models.CharField('Название зала', max_length=255)
    purpose = models.CharField('Назначение', max_length=255)
    capacity = models.PositiveIntegerField('Вместимость')

    class Meta:
        verbose_name = 'Зал'
        verbose_name_plural = 'Залы'
        ordering = ['name']

    def __str__(self):
        return self.name


class LessonType(models.Model):
    LEVEL_CHOICES = [
        ('Любой', 'Любой'),
        ('Начальный', 'Начальный'),
        ('Средний', 'Средний'),
        ('Продвинутый', 'Продвинутый'),
    ]

    name = models.CharField('Название типа', max_length=255)
    description = models.TextField('Описание')
    level = models.CharField('Уровень подготовки', max_length=20, choices=LEVEL_CHOICES, default='Любой')
    duration_min = models.PositiveIntegerField('Длительность (мин)')

    class Meta:
        verbose_name = 'Тип занятия'
        verbose_name_plural = 'Типы занятий'
        ordering = ['name']

    def __str__(self):
        return self.name


class ScheduleItem(models.Model):
    trainer = models.ForeignKey(Trainer, on_delete=models.PROTECT, related_name='schedule_items', verbose_name='Тренер')
    hall = models.ForeignKey(Hall, on_delete=models.PROTECT, related_name='schedule_items', verbose_name='Зал')
    lesson_type = models.ForeignKey(
        LessonType, on_delete=models.PROTECT, related_name='schedule_items', verbose_name='Тип занятия'
    )
    date = models.DateField('Дата')
    start_time = models.TimeField('Начало')
    end_time = models.TimeField('Окончание')

    class Meta:
        verbose_name = 'Расписание занятия'
        verbose_name_plural = 'Расписание занятий'
        ordering = ['date', 'start_time']

    def __str__(self):
        return f'{self.date} {self.start_time} — {self.lesson_type.name}'


class Booking(models.Model):
    STATUS_PLANNED = 'Запланировано'
    STATUS_VISITED = 'Посещено'
    STATUS_CANCELLED = 'Отменено'
    STATUS_CHOICES = [
        (STATUS_PLANNED, 'Запланировано'),
        (STATUS_VISITED, 'Посещено'),
        (STATUS_CANCELLED, 'Отменено'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='bookings', verbose_name='Клиент')
    schedule = models.ForeignKey(
        ScheduleItem, on_delete=models.CASCADE, related_name='bookings', verbose_name='Занятие'
    )
    booking_date = models.DateField('Дата записи')
    status = models.CharField('Статус записи', max_length=20, choices=STATUS_CHOICES, default=STATUS_PLANNED)

    class Meta:
        verbose_name = 'Запись на занятие'
        verbose_name_plural = 'Записи на занятия'
        ordering = ['-booking_date']

    def __str__(self):
        return f'{self.client} → {self.schedule}'


class Visit(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='visits', verbose_name='Клиент')
    schedule = models.ForeignKey(
        ScheduleItem, on_delete=models.CASCADE, related_name='visits', verbose_name='Занятие'
    )
    visit_date = models.DateField('Дата посещения')

    class Meta:
        verbose_name = 'Посещение'
        verbose_name_plural = 'Посещения'
        ordering = ['-visit_date']

    def __str__(self):
        return f'{self.client} — {self.visit_date}'


class Payment(models.Model):
    METHOD_CHOICES = [
        ('Банковская карта', 'Банковская карта'),
        ('Наличные', 'Наличные'),
        ('Перевод', 'Перевод'),
    ]
    STATUS_CHOICES = [
        ('Успешно', 'Успешно'),
        ('Ожидание', 'Ожидание'),
        ('Отменён', 'Отменён'),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='payments', verbose_name='Договор')
    payment_date = models.DateField('Дата оплаты')
    amount = models.DecimalField('Сумма оплаты', max_digits=10, decimal_places=2)
    method = models.CharField('Способ оплаты', max_length=50, choices=METHOD_CHOICES)
    status = models.CharField('Статус оплаты', max_length=20, choices=STATUS_CHOICES, default='Успешно')
    receipt_number = models.CharField('Номер чека', max_length=50)

    class Meta:
        verbose_name = 'Платёж'
        verbose_name_plural = 'Платежи'
        ordering = ['-payment_date']

    def __str__(self):
        return f'{self.receipt_number} — {self.amount}'

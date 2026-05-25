from django.core.management.base import BaseCommand
from django.utils import timezone

from gym.models import Booking, Client, Contract, Hall, LessonType, Membership, Payment, ScheduleItem, Trainer, Visit


class Command(BaseCommand):

    def handle(self, *args, **options):
        if Client.objects.exists():
            self.stdout.write('Данные уже есть, пропускаю.')
            return

        clients = [
            Client.objects.create(
                full_name='Василий Васильев Васильевич',
                passport_data='4510 123456',
                phone='+7 (918) 123-45-67',
                email='vasily@mail.ru',
                birth_date='2000-12-12',
                address='г. Краснодар, ул. Красная, 1',
            ),
            Client.objects.create(
                full_name='Анна Петрова Сергеевна',
                passport_data='4511 654321',
                phone='+7 (918) 234-56-78',
                email='anna.petrov@mail.ru',
                birth_date='1995-03-20',
                address='г. Краснодар, ул. Северная, 15',
            ),
            Client.objects.create(
                full_name='Игорь Смирнов Алексеевич',
                passport_data='4512 789012',
                phone='+7 (918) 345-67-89',
                email='igor.sm@mail.ru',
                birth_date='1988-07-05',
                address='г. Краснодар, ул. Ставропольская, 42',
            ),
        ]

        memberships = [
            Membership.objects.create(
                name='Месячный безлимит',
                description='Посещение зала без ограничений в течение месяца',
                duration_days=30,
                base_price=3500,
                sessions_count=30,
            ),
            Membership.objects.create(
                name='12 занятий',
                description='Абонемент на 12 групповых занятий',
                duration_days=60,
                base_price=4800,
                sessions_count=12,
            ),
            Membership.objects.create(
                name='Персональные тренировки (8)',
                description='8 индивидуальных занятий с тренером',
                duration_days=45,
                base_price=12000,
                sessions_count=8,
            ),
        ]

        contracts = [
            Contract.objects.create(
                number='ДГ-001', date='2026-05-17',
                client=clients[0], membership=memberships[0], discount=10,
            ),
            Contract.objects.create(
                number='ДГ-002', date='2026-05-20',
                client=clients[1], membership=memberships[1], discount=0,
            ),
            Contract.objects.create(
                number='ДГ-003', date='2026-05-22',
                client=clients[2], membership=memberships[2], discount=5,
            ),
        ]

        trainers = [
            Trainer.objects.create(
                full_name='Олег Николаев', specialization='Силовые тренировки',
                phone='+7 (918) 111-22-33', email='o.nikolaev@fitclub.ru',
                experience_years=8, category='Высшая',
            ),
            Trainer.objects.create(
                full_name='Мария Козлова', specialization='Йога, пилатес',
                phone='+7 (918) 222-33-44', email='m.kozlova@fitclub.ru',
                experience_years=5, category='Первая',
            ),
        ]

        halls = [
            Hall.objects.create(name='Тренажерный зал 1', purpose='Силовые тренировки', capacity=25),
            Hall.objects.create(name='Зал групповых занятий', purpose='Йога, пилатес, кардио', capacity=20),
        ]

        lesson_types = [
            LessonType.objects.create(
                name='Персональная тренировка',
                description='Индивидуальное занятие с тренером',
                level='Любой', duration_min=60,
            ),
            LessonType.objects.create(
                name='Йога', description='Групповое занятие по йоге',
                level='Начальный', duration_min=90,
            ),
            LessonType.objects.create(
                name='Кроссфит', description='Высокоинтенсивная групповая тренировка',
                level='Средний', duration_min=60,
            ),
        ]

        schedule = [
            ScheduleItem.objects.create(
                trainer=trainers[0], hall=halls[0], lesson_type=lesson_types[0],
                date='2026-05-25', start_time='10:00', end_time='11:00',
            ),
            ScheduleItem.objects.create(
                trainer=trainers[1], hall=halls[1], lesson_type=lesson_types[1],
                date='2026-05-25', start_time='18:00', end_time='19:30',
            ),
            ScheduleItem.objects.create(
                trainer=trainers[0], hall=halls[0], lesson_type=lesson_types[2],
                date='2026-05-26', start_time='19:00', end_time='20:00',
            ),
        ]

        Booking.objects.create(client=clients[0], schedule=schedule[0], booking_date='2026-05-21')
        Booking.objects.create(client=clients[1], schedule=schedule[1], booking_date='2026-05-22')
        Booking.objects.create(
            client=clients[2], schedule=schedule[2],
            booking_date='2026-05-23', status='Отменено',
        )

        Visit.objects.create(client=clients[0], schedule=schedule[0], visit_date='2026-05-17')
        Visit.objects.create(client=clients[1], schedule=schedule[1], visit_date='2026-05-20')

        Payment.objects.create(
            contract=contracts[0], payment_date='2026-05-17',
            amount=3150, method='Банковская карта', receipt_number='СНК-1001',
        )
        Payment.objects.create(
            contract=contracts[1], payment_date='2026-05-20',
            amount=4800, method='Наличные', receipt_number='СНК-1002',
        )
        Payment.objects.create(
            contract=contracts[2], payment_date='2026-05-22',
            amount=11400, method='Банковская карта', receipt_number='СНК-1003',
        )

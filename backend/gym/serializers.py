from rest_framework import serializers

from .models import Booking, Client, Contract, Hall, LessonType, Membership, Payment, ScheduleItem, Trainer, Visit


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'full_name', 'passport_data', 'phone', 'email', 'birth_date', 'address']


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = [
            'id', 'name', 'description', 'duration_days',
            'base_price', 'sessions_count', 'status',
        ]


class ContractSerializer(serializers.ModelSerializer):
    client_id = serializers.PrimaryKeyRelatedField(source='client', queryset=Client.objects.all())
    membership_id = serializers.PrimaryKeyRelatedField(source='membership', queryset=Membership.objects.all())

    class Meta:
        model = Contract
        fields = [
            'id', 'number', 'date', 'client_id', 'membership_id',
            'discount', 'total_price', 'club_name', 'expiry_date',
        ]
        read_only_fields = ['total_price', 'expiry_date']


class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = [
            'id', 'full_name', 'specialization', 'phone',
            'email', 'experience_years', 'category',
        ]


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ['id', 'name', 'purpose', 'capacity']


class LessonTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonType
        fields = ['id', 'name', 'description', 'level', 'duration_min']


class ScheduleItemSerializer(serializers.ModelSerializer):
    trainer_id = serializers.PrimaryKeyRelatedField(source='trainer', queryset=Trainer.objects.all())
    hall_id = serializers.PrimaryKeyRelatedField(source='hall', queryset=Hall.objects.all())
    lesson_type_id = serializers.PrimaryKeyRelatedField(source='lesson_type', queryset=LessonType.objects.all())

    class Meta:
        model = ScheduleItem
        fields = [
            'id', 'trainer_id', 'hall_id', 'lesson_type_id',
            'date', 'start_time', 'end_time',
        ]


class BookingSerializer(serializers.ModelSerializer):
    client_id = serializers.PrimaryKeyRelatedField(source='client', queryset=Client.objects.all())
    schedule_id = serializers.PrimaryKeyRelatedField(source='schedule', queryset=ScheduleItem.objects.all())

    class Meta:
        model = Booking
        fields = ['id', 'client_id', 'schedule_id', 'booking_date', 'status']


class VisitSerializer(serializers.ModelSerializer):
    client_id = serializers.PrimaryKeyRelatedField(source='client', queryset=Client.objects.all())
    schedule_id = serializers.PrimaryKeyRelatedField(source='schedule', queryset=ScheduleItem.objects.all())

    class Meta:
        model = Visit
        fields = ['id', 'client_id', 'schedule_id', 'visit_date']


class PaymentSerializer(serializers.ModelSerializer):
    contract_id = serializers.PrimaryKeyRelatedField(source='contract', queryset=Contract.objects.all())

    class Meta:
        model = Payment
        fields = [
            'id', 'contract_id', 'payment_date', 'amount',
            'method', 'status', 'receipt_number',
        ]

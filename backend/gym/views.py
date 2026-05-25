from datetime import date

from django.db.models import Count, Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Booking, Client, Contract, Hall, LessonType, Membership, Payment, ScheduleItem, Trainer, Visit
from .serializers import (
    BookingSerializer,
    ClientSerializer,
    ContractSerializer,
    HallSerializer,
    LessonTypeSerializer,
    MembershipSerializer,
    PaymentSerializer,
    ScheduleItemSerializer,
    TrainerSerializer,
    VisitSerializer,
)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    @action(detail=True, methods=['get'])
    def contracts(self, request, pk=None):
        membership = self.get_object()
        contracts = Contract.objects.filter(membership=membership)
        return Response(ContractSerializer(contracts, many=True).data)


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.select_related('client', 'membership').all()
    serializer_class = ContractSerializer

    @action(detail=True, methods=['get', 'post'])
    def payments(self, request, pk=None):
        contract = self.get_object()
        if request.method == 'GET':
            payments = contract.payments.all()
            return Response(PaymentSerializer(payments, many=True).data)

        data = request.data.copy()
        data['contract_id'] = contract.id
        serializer = PaymentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer


class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer


class LessonTypeViewSet(viewsets.ModelViewSet):
    queryset = LessonType.objects.all()
    serializer_class = LessonTypeSerializer


class ScheduleItemViewSet(viewsets.ModelViewSet):
    queryset = ScheduleItem.objects.select_related('trainer', 'hall', 'lesson_type').all()
    serializer_class = ScheduleItemSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('client', 'schedule').all()
    serializer_class = BookingSerializer


class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.select_related('client', 'schedule').all()
    serializer_class = VisitSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('contract', 'contract__client').all()
    serializer_class = PaymentSerializer


class ReportViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        return Response({
            'clients_count': Client.objects.count(),
            'active_contracts': Contract.objects.count(),
            'total_revenue': Payment.objects.filter(status='Успешно').aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'today_visits': Visit.objects.filter(visit_date=date.today()).count(),
        })

    @action(detail=False, methods=['get'], url_path='clients')
    def clients_report(self, request):
        data = Client.objects.values('full_name', 'phone', 'email', 'birth_date')
        return Response(list(data))

    @action(detail=False, methods=['get'], url_path='payments')
    def payments_report(self, request):
        payments = Payment.objects.select_related('contract', 'contract__client').all()
        data = [
            {
                'contract_number': p.contract.number,
                'client_name': p.contract.client.full_name,
                'payment_date': p.payment_date,
                'amount': p.amount,
                'method': p.method,
                'status': p.status,
            }
            for p in payments
        ]
        return Response(data)

    @action(detail=False, methods=['get'], url_path='attendance')
    def attendance_report(self, request):
        data = (
            Visit.objects
            .select_related('schedule__lesson_type', 'schedule__hall')
            .values('schedule__lesson_type__name', 'schedule__hall__name')
            .annotate(visits_count=Count('id'))
            .order_by('-visits_count')
        )
        return Response([
            {
                'lesson_type': row['schedule__lesson_type__name'],
                'hall_name': row['schedule__hall__name'],
                'visits_count': row['visits_count'],
            }
            for row in data
        ])

    @action(detail=False, methods=['get'], url_path='membership-sales')
    def membership_sales_report(self, request):
        data = []
        for membership in Membership.objects.all():
            contracts = Contract.objects.filter(membership=membership)
            data.append({
                'membership_name': membership.name,
                'contracts_count': contracts.count(),
                'total_revenue': contracts.aggregate(total=Sum('total_price'))['total'] or 0,
            })
        return Response(data)

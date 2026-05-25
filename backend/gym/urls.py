from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BookingViewSet,
    ClientViewSet,
    ContractViewSet,
    HallViewSet,
    LessonTypeViewSet,
    MembershipViewSet,
    PaymentViewSet,
    ReportViewSet,
    ScheduleItemViewSet,
    TrainerViewSet,
    VisitViewSet,
)

router = DefaultRouter()
router.register('clients', ClientViewSet)
router.register('memberships', MembershipViewSet)
router.register('contracts', ContractViewSet)
router.register('trainers', TrainerViewSet)
router.register('halls', HallViewSet)
router.register('lesson-types', LessonTypeViewSet)
router.register('schedule', ScheduleItemViewSet)
router.register('bookings', BookingViewSet)
router.register('visits', VisitViewSet)
router.register('payments', PaymentViewSet)
router.register('reports', ReportViewSet, basename='reports')

urlpatterns = [
    path('', include(router.urls)),
]

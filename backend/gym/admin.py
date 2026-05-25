from django.contrib import admin

from .models import Booking, Client, Contract, Hall, LessonType, Membership, Payment, ScheduleItem, Trainer, Visit

admin.site.register(Client)
admin.site.register(Membership)
admin.site.register(Contract)
admin.site.register(Trainer)
admin.site.register(Hall)
admin.site.register(LessonType)
admin.site.register(ScheduleItem)
admin.site.register(Booking)
admin.site.register(Visit)
admin.site.register(Payment)

admin.site.site_header = 'FitClub Admin'
admin.site.site_title = 'FitClub'
admin.site.index_title = 'Управление фитнес-залом'

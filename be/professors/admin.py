from django.contrib import admin

# Register your models here.
from .models import Professors,LocationImage

admin.site.register(Professors)
admin.site.register(LocationImage)
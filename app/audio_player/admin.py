from django.contrib import admin
from .models import UserProfile, Comment, Song

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Comment)
admin.site.register(Song)

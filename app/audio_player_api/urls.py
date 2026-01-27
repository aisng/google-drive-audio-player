from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views


urlpatterns = [
    path("songs/", views.get_songs),
    path("song/<str:pk>", views.SongDetail.as_view()),
    path("stream/<str:id>", views.stream_song),
]

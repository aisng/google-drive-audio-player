from django.urls import path
from . import views


urlpatterns = [
    path("songs/", views.get_songs),
    path("song/<str:pk>", views.SongDetail.as_view()),
    path("stream/<str:id>", views.stream_song),
    path("user/", views.CurrentUser.as_view()),
    path("comments/", views.CommentList.as_view()),
    path("comments/<int:pk>/", views.CommentDetail.as_view()),
]

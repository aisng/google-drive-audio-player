from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views


urlpatterns = [
    path("songs/", login_required(views.get_songs)),
    path("song/<str:pk>", views.SongDetail.as_view()),
    path("stream/<str:id>", login_required(views.stream_song)),
    path("current_user/", views.CurrentUser.as_view()),
    path("comments/", views.CommentList.as_view()),
    path("comments/<int:pk>", views.CommentDetail.as_view()),
]

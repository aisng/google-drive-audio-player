from googleapiclient.errors import HttpError
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from .get_drive_data import get_file_list, download_file
from django.http import HttpResponse, StreamingHttpResponse
from audio_player.models import Comment, Song
import os
from audio_player_api.serializers import (
    UserSerializer,
    CommentSerializer,
    SongSerializer,
)

API_URL = os.environ.get("API_URL")


@api_view(["GET"])
def get_songs(request):
    song_url_wo_id = API_URL + "/stream/"
    file_list_from_drive = get_file_list()
    # create paths for songs for streaming and save their info in db
    for item in file_list_from_drive:
        try:
            Song.objects.get(pk=item["id"])
        except Song.DoesNotExist:
            item["path"] = song_url_wo_id + item["id"]
            item["title"] = item["name"]
            del item["name"]
            serializer = SongSerializer(data=item)
            if serializer.is_valid():
                serializer.save()

    all_songs = Song.objects.all()
    return Response(SongSerializer(all_songs, many=True).data)


@api_view(["GET"])
def stream_song(request, id):
    audio_file, error = download_file(id)
    if not audio_file and error:
        return Response(
            {"details": error},
            status=status.HTTP_404_NOT_FOUND,
        )
    return HttpResponse(audio_file, content_type="audio/mpeg")


class SongDetail(generics.RetrieveAPIView):
    serializer_class = SongSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Song.objects.get(pk=self.kwargs["pk"])


class CurrentUser(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        comment = Comment.objects.filter(pk=kwargs["pk"], user=self.request.user)
        if comment.exists():
            return self.destroy(request, *args, **kwargs)
        else:
            raise ValidationError("You can only delete comments that you wrote.")

    def put(self, request, *args, **kwargs):
        comment = Comment.objects.filter(pk=kwargs["pk"], user=self.request.user)
        if comment.exists():
            return self.update(request, *args, **kwargs)
        else:
            raise ValidationError("You can only edit comments that you wrote.")

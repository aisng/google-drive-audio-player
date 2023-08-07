from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from audio_player_api.serializers import (
    UserSerializer,
    CommentSerializer,
    SongSerializer,
)
from .get_drive_data import get_file_list, download_file
from django.http import StreamingHttpResponse
from audio_player.models import Comment, Song

SONG_URL = "http://127.0.0.1:1337/api/song/"


@api_view(["GET"])
def get_songs(request):
    file_list_from_drive = get_file_list()

    for item in file_list_from_drive:
        item["path"] = SONG_URL + item["id"]
        try:
            song = Song.objects.get(pk=item["id"])
        except Song.DoesNotExist:
            song = Song(id=item["id"], title=item["name"])
            song.save()
            # serializer = SongSerializer(data=song_data)
            # if serializer.is_valid():
            #     serializer.save()
    return Response(file_list_from_drive)


@api_view(["GET"])
def stream_song(request, id):
    audio_file = download_file(id)
    return StreamingHttpResponse(audio_file, content_type="audio/mpeg")


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


# @api_view(["GET"])
# def list_comments(request):
#     if request.method == "GET":
#         comments = Comment.objects.all()
#         serializer = CommentSerializer(comments, many=True)
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["POST"])
# def create_comment(request):
#     print("REQ_DATA", request.data)
#     serializer = CommentSerializer(data=request.data)
#     print("SER_DATA_INITIAL", serializer.initial_data)
#     if serializer.is_valid(raise_exception=True):
#         serializer.save()
#         print("SER_DATA", serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

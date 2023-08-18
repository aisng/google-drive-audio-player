from django.urls import reverse
from rest_framework import serializers
from audio_player.models import Comment, Song, User


class UserSerializer(serializers.ModelSerializer):
    profile_pic_url = serializers.SerializerMethodField()
    profile_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "profile_pic_url", "profile_url")

    def get_profile_pic_url(self, instance):
        request = self.context.get("request")
        if instance.profile.profile_pic:
            profile_pic_url = instance.profile.profile_pic.url
            return request.build_absolute_uri(profile_pic_url)
        return None

    def get_profile_url(self, instance):
        request = self.context.get("request")
        if instance.username:
            profile_url = reverse("profile", kwargs={"username": instance.username})
            return request.build_absolute_uri(profile_url)
        return None


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(source="user", read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    song_id = serializers.CharField(write_only=False, allow_null=True)
    parent_id = serializers.IntegerField(write_only=False, allow_null=True)

    class Meta:
        model = Comment
        fields = (
            "id",
            "user_id",
            "body",
            "parent_id",
            "song_id",
            "date_created",
            "timestamp",
            "author",
        )

    def get_parent_id(self, instance):
        if instance.parent:
            return instance.parent.id
        return None

    def create(self, validated_data):
        parent_id = validated_data.pop("parent_id")
        comment = Comment.objects.create(**validated_data)
        if parent_id:
            parent_comment = Comment.objects.get(pk=parent_id)
            comment.parent = parent_comment
            comment.save()
        return comment


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ("id", "title", "path")

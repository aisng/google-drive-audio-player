from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault
from audio_player.models import UserProfile, Comment, Song, User


class CommentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=False)
    song_id = serializers.CharField(write_only=False, allow_null=True)
    parent_id = serializers.IntegerField(write_only=False, allow_null=True)
    username = serializers.SerializerMethodField(write_only=False)
    user_profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = (
            "id",
            "user_id",
            "username",
            "body",
            "parent_id",
            "song_id",
            "date_created",
            "user_profile_pic",
            "timestamp",
        )

    def get_parent_id(self, instance):
        if instance.parent:
            return instance.parent.id
        return None

    def get_username(self, instance):
        if instance.user:
            return instance.user.username
        return None

    def get_user_profile_pic(self, instance):
        request = self.context.get("request")
        if instance.user:
            profile_pic_url = instance.user.profile.profile_pic.url
            return request.build_absolute_uri(profile_pic_url)
        return None


    def create(self, validated_data):
        parent_id = validated_data.pop("parent_id")
        comment = Comment.objects.create(**validated_data)
        if parent_id:
            parent_comment = Comment.objects.get(pk=parent_id)
            comment.parent = parent_comment
            comment.save()
        return comment


class UserSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "profile_pic")

    def get_profile_pic(self, instance):
        request = self.context.get("request")
        if instance.profile.profile_pic:
            profile_pic_url = instance.profile.profile_pic.url
            return request.build_absolute_uri(profile_pic_url)
        return None


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ("id", "title")

from django.contrib import admin
from .models import UserProfile, Comment, Song


class CommentAdmin(admin.ModelAdmin):
    # readonly_fields = ("user", "parent", "song", "date_created")
    list_display = (
        "comment_body",
        "comment_author",
        "song_title",
        "reply_count",
        "date_created",
    )
    exclude = ("parent",)

    def comment_body(self, obj):
        return obj.short_body

    def comment_author(self, obj):
        return obj.user

    def song_title(self, obj):
        return obj.song.title

    def reply_count(self, obj):
        return obj.replies.count()

    def get_queryset(self, request):
        return super().get_queryset(request).filter(parent__isnull=True)

    comment_body.short_description = "Comment"
    comment_author.short_description = "Author"
    song_title.short_description = "Song title"
    reply_count.short_description = "Reply count"


class Reply(Comment):
    class Meta:
        proxy = True
        verbose_name = "Reply"
        verbose_name_plural = "Replies"


class ReplyAdmin(admin.ModelAdmin):
    # readonly_fields = ("user", "parent", "song", "date_created")
    list_display = (
        "reply_body",
        "reply_author",
        "comment_id",
        "comment_body",
        "comment_author",
        "date_created",
    )
    exclude = (
        "timestamp",
        "song",
        "parent",
    )

    def reply_body(self, obj):
        return obj.short_body

    def reply_author(self, obj):
        return obj.user

    def comment_id(self, obj):
        return obj.parent_id

    def comment_body(self, obj):
        return obj.parent.short_body

    def comment_author(self, obj):
        return obj.parent.user

    def get_queryset(self, request):
        return super().get_queryset(request).filter(parent__isnull=False)

    reply_body.short_description = "Reply"
    reply_author.short_description = "Author"
    comment_id.short_description = "Comment id"
    comment_body.short_description = "Comment body"
    comment_author.short_description = "Comment author"


class SongAdmin(admin.ModelAdmin):
    readonly_fields = ("id", "path")
    list_display = (
        "id",
        "title",
        "path",
    )


# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Reply, ReplyAdmin)
admin.site.register(Song, SongAdmin)

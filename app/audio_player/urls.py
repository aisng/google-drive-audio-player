from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.contrib.auth import views as auth_views
from .forms import EmailValidationOnForgotPassword

urlpatterns = [
    path("", views.index, name="index"),
    path("profile/", views.user_profile, name="profile"),
    path("profile/edit/", views.edit_user_profile, name="edit_profile"),
    path("register/", views.register_request, name="register"),
    path(
        "profile/edit/pw-change/",
        views.ChangePasswordView.as_view(),
        name="password_change",
    ),
    path(
        "login/",
        auth_views.LoginView.as_view(),
        {"template_name": "login.html"},
        name="login",
    ),
    path(
        "logout/",
        auth_views.LogoutView.as_view(),
        name="logout",
    ),
    path(
        "reset_password/",
        auth_views.PasswordResetView.as_view(
            form_class=EmailValidationOnForgotPassword
        ),
        name="reset_password",
    ),
    path(
        "reset_password_sent/",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset_password_complete/",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# urlpatterns += [
#     path("accounts/", include("django.contrib.auth.urls")),
# ]

from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.models import User
from django.urls import reverse_lazy, reverse
from django.views.decorators.csrf import csrf_protect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import PasswordChangeView
from django.contrib.messages.views import SuccessMessageMixin
from .forms import RegistrationForm, UpdateProfileForm, UpdateUserForm
from django.core.paginator import Paginator
from .models import Comment

# Create your views here.


def index(request):
    return render(request, "index.html")


@login_required
def user_profile(request, username):
    user_profile_viewed = get_object_or_404(User, username=username)
    is_profile_owner = request.user == user_profile_viewed
    if is_profile_owner:
        user_comments = Comment.objects.filter(user=request.user, parent__isnull=True)
        user_replies = Comment.objects.filter(user=request.user, parent__isnull=False)
        replies_to_owner = Comment.objects.filter(parent__user=request.user)
        replies_to_owner_paginator = Paginator(replies_to_owner, 5)
        replies_to_owner_page_number = request.GET.get("page_rep_own")
        paged_replies_to_owner = replies_to_owner_paginator.get_page(
            replies_to_owner_page_number
        )
    else:
        user_comments = Comment.objects.filter(
            user=user_profile_viewed, parent__isnull=True
        )
        user_replies = Comment.objects.filter(
            user=user_profile_viewed, parent__isnull=False
        )
        replies_to_owner = None
    comments_paginator = Paginator(user_comments, 5)
    replies_paginator = Paginator(user_replies, 5)

    comments_page_number = request.GET.get("page_comm")
    replies_page_number = request.GET.get("page_rep")

    paged_comments = comments_paginator.get_page(comments_page_number)
    paged_replies = replies_paginator.get_page(replies_page_number)

    return render(
        request,
        "user_profile.html",
        {
            "user_comments": paged_comments,
            "user_replies": paged_replies,
            "replies_to_owner": paged_replies_to_owner if is_profile_owner else None,
            "user_profile_viewed": user_profile_viewed,
        },
    )


@login_required
def edit_user_profile(request):
    if request.method == "POST":
        user_form = UpdateUserForm(request.POST, instance=request.user)
        profile_form = UpdateProfileForm(
            request.POST, request.FILES, instance=request.user.profile
        )

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, "Your profile was updated successfully")
            return redirect(
                reverse("profile", kwargs={"username": request.user.username})
            )
    else:
        user_form = UpdateUserForm(instance=request.user)
        profile_form = UpdateProfileForm(instance=request.user.profile)
    return render(
        request,
        "edit_user_profile.html",
        {"user_form": user_form, "profile_form": profile_form},
    )


@csrf_protect
def register_request(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            # login(request, user)
            messages.success(request, "Registration successful. You can now login.")
            return redirect("login")
        for _, errors in form.errors.items():
            for error in errors:
                messages.error(request, error)
    form = RegistrationForm()
    return render(request, "registration/register.html", context={"reg_form": form})


@csrf_protect
def login_request(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("index")
        else:
            messages.error(request, "Invalid username or password.")
    elif request.method == "GET":
        form = AuthenticationForm()
    return render(request, "registration/login.html", context={"form": form})


class ChangePasswordView(SuccessMessageMixin, PasswordChangeView):
    template_name = "change_password.html"
    success_message = "Password changed succesfully."

    def form_valid(self, form):
        username = self.request.user.username
        self.success_url = reverse_lazy("profile", kwargs={"username": username})
        return super().form_valid(form)

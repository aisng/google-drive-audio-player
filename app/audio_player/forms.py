from django import forms
from django.contrib.auth.forms import UserCreationForm, PasswordResetForm
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from .models import UserProfile


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = get_user_model()
        fields = ("username", "email", "password1", "password2")
        labels = {
            "username": "Username",
            "email": "Email",
            "password1": "Password",
            "password2": "Password confirmation",
        }

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if email and get_user_model().objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already in use.")
        return email

    def save(self, commit=True):
        user = super(RegistrationForm, self).save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class EmailValidationOnForgotPassword(PasswordResetForm):
    def clean_email(self):
        email = self.cleaned_data["email"]
        if not User.objects.filter(email__iexact=email, is_active=True).exists():
            raise forms.ValidationError(
                "There is no user registered with the specified email address."
            )
        return email


class UpdateUserForm(forms.ModelForm):
    username = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={"class": "form-control"}),
    )
    email = forms.EmailField(
        required=True, widget=forms.TextInput(attrs={"class": "form-control"})
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
        )


class UpdateProfileForm(forms.ModelForm):
    profile_pic = forms.ImageField(
        widget=forms.FileInput(attrs={"class": "form-control-file small"})
    )

    class Meta:
        model = UserProfile
        fields = ("profile_pic",)

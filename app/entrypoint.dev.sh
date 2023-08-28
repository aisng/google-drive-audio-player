#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py makemigrations
python manage.py migrate --no-input
python manage.py shell <<EOF
from django.contrib.auth.models import User
superuser = User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME", is_superuser=True)
User.objects.create_superuser("$DJANGO_SUPERUSER_USERNAME", "$DJANGO_SUPERUSER_EMAIL", "$DJANGO_SUPERUSER_PASSWORD") if not superuser else print("SuperUser exists")
EOF

python manage.py runserver 0.0.0.0:8000 

exec "$@"


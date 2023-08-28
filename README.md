# Google Drive audio player

Hybrid Django and React application for playing audio files from Google Drive. Registered users can listen and add comments to audio files that are fetched from a specific folder in Google Drive.

## Usage

### Google developer account setup
In order to use this app one has to have an account in https://console.cloud.google.com/ with Google Drive API service enabled.
1. Create a project in https://console.cloud.google.com/
2. Create new OAuth Client ID credentials and download the .json file.
3. Rename the file to `credentials.json` and place it in `app/audio_player_api/`.

### Environment setup
As of now there are two docker envirnoments: one for development (where React page runs on vite dev server with hot reload) and one for production (where React is bundled to static files and is served to Django via nginx). Both environments require `.env` files located within the root directory (together with `docker-compose.yml` and `docker-compose.prod.yml` files):
- `.env.dev` for development
- `.env.prod` together with `.env.prod.db` for production


Notice that in the examples below the **PostgreSQL** username is *ap_user* in development and *gdap_user* in production with the same password *44use98* used for both environments.

1. For development the `.env.dev` should have the following variables:
```bash
DEBUG=1
SECRET_KEY=<your_secret_key>
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
API_URL=http://127.0.0.1:8000/api
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=ap-db-dev
SQL_USER=ap_user # must match docker-compose.yml db env var
SQL_PASSWORD=44use98 # must match docker-compose.yml db env var
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres
# EMAIL_* vars are used to send password reset instructions to the user
EMAIL_USERNAME=<your_email> 
EMAIL_PASSWORD=<your_email_password>
EMAIL_HOST=<your_email_host>
EMAIL_PORT=<your_email_port>
EMAIL_USE_TLS=1
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=<django_superuser_email>
DJANGO_SUPERUSER_PASSWORD=<django_superuser_password>
GOOGLE_DRIVE_FOLDER_ID=<id_of_folder_with_audio_files>
```
2. Production environment runs a bit smoother as there is no need to run both Django and React dev servers. The `.env.prod` must have the same vars as `.env.prod` with few differences:
```bash
DEBUG=0 # debug is set to false
...
API_URL=http://127.0.0.1:1337/api # notice the nginx port number
...
SQL_DATABASE=audio-player-db # different db name than in dev, must match POSTGRES_DB in .env.prod.db
SQL_USER=gdap_user # must match POSTGRES_USER in .env.prod.db 
SQL_PASSWORD=44use98 # must match POSTGRES_PASSWORD in .env.prod.db 
...
```

There is also a separate file for database service environment `.env.prod.db` which has the following vars (that are the same as the ones passed to `docker-compose.yml` which spins up the dev containers):
```bash
POSTGRES_USER=gdap_user # must match SQL_USER in .env.prod
POSTGRES_PASSWORD=44use98 # must match SQL_PASSWORD in .env.prod
POSTGRES_DB=audio-player-db # must match SQL_DATABASE in .env.prod
```


If you are changing the db user credentials in prod environment, make sure to change the following lines in app/Dockerfile.prod so that the updated db service user matches `<username>` that gets priviliges within the container. You might as well want to choose a more appropriate `<group_name>`:
1. Line 54 
```bash
RUN addgroup --system <group_name> && adduser --system --group <username>
```
2. Line 73
```bash
COPY --from=builder2 --chown=<username>:<group_name> /usr/src/app/dist/ ./staticfiles
```
3. Line 84
```bash
RUN chown -R <username>:<group_name> $APP_HOME
```
4. Line 87
```bash
USER <username>
```

### Running the containers
1. Developement:
```bash
docker compose up 
```
2. Production:
```bash
docker compose -f docker-compose.prod.yml up 
```

### NB!
app/entrypoint.prod.sh script runs the migrations everytime the prod containers are started.

## Known issues
1. Deleting User or UserProfile model instances might crash the app as the `on_delete` properties are not configured properly.
2. Deleting Comment model instances via Axios request in React leaves orphan comments. Related to the first issue.
3. Longer audio files might be slow to load (~2 seconds for ~18 minutes in prod env) as I couldn't yet figure out how to receive audio data in chunks with Wavesurfer.js player.
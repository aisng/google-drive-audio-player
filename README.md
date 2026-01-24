# Google Drive audio player

Hybrid Django and React application for playing audio files from Google Drive. Registered users can listen and add comments to audio files that are fetched from a specific folder in Google Drive.

## Usage

### Google Cloud account setup

In order to use this app one has to have an account at https://console.cloud.google.com/ with Google Drive API service enabled. Refer to official documentation at https://cloud.google.com/docs for more info on the rough guidelines below.

1. Create a project in https://console.cloud.google.com/
2. Create a Service Account.
3. Create a Service Account Key, download the `.json` file.
4. Rename the file to `service_key.json` and place it in `app/audio_player_api/`.
5. Share the Google Drive folder containing audio files with the Service Account email.
6. Get the folder ID from the browser URL when viewing the folder:
   ```
   https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE
   ```
   Copy the ID after `/folders/` and use it for the `GOOGLE_DRIVE_FOLDER_ID` environment variable.

### Environment setup

Two Docker environments are available via a single `docker-compose.yml`:
- **Development**: React on Vite dev server with hot reload, PostgreSQL database
- **Production**: React bundled to static files served via Django + Nginx, PostgreSQL database

Each environment requires its own `.env` file in the root project directory:

- `.env.dev` for development
- `.env.prod` for production

Copy the example files and fill in your actual values:

```bash
cp .env.dev.example .env.dev
cp .env.prod.example .env.prod
```

Refer to `.env.dev.example` and `.env.prod.example` for all required variables and descriptions.

**Note:** If you get "permission denied" errors on entrypoint scripts, ensure they have execute permissions:
```bash
chmod +x app/entrypoint.dev.sh app/entrypoint.prod.sh
```

If you change the database user credentials in production, update the following in `app/Dockerfile.prod`:

1. Line 54 - Change `<username>` and `<group_name>`:

```bash
RUN addgroup --system <group_name> && adduser --system --group <username>
```

2. Line 73 - Update `<username>:<group_name>`:

```bash
COPY --from=builder2 --chown=<username>:<group_name> /usr/src/app/dist/ ./staticfiles
```

3. Line 84 - Update `<username>:<group_name>`:

```bash
RUN chown -R <username>:<group_name> $APP_HOME
```

4. Line 87 - Change `<username>`:

```bash
USER <username>
```

### Running the containers

Development:

```bash
docker compose --profile dev up
```

Production:

```bash
docker compose --profile prod up
```

To rebuild containers, add the `--build` flag:

```bash
docker compose --profile dev up --build
docker compose --profile prod up --build
```

### Accessing the application

Once the containers are running:

- **Development**: http://127.0.0.1:8000 (Django development server)
  - React dev server: http://127.0.0.1:5173
  - Django API: http://127.0.0.1:8000/api/

- **Production**: http://127.0.0.1:1337 (via Nginx)
  - All requests (frontend + API) served through Nginx

### NB!

app/entrypoint.prod.sh script runs the migrations everytime the prod containers are started.

## Known issues

1. Deleting User or UserProfile model instances might crash the app as the `on_delete` properties are not configured properly.
2. Deleting Comment model instances via Axios request in React leaves orphan comments. Related to the first issue.
3. Longer audio files might be slow to load (~2 seconds for ~18 minutes .mp3 in prod env) as I couldn't yet figure out how to receive audio data in chunks with Wavesurfer.js player.

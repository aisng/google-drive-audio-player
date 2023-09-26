from __future__ import print_function

import os
import io


from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2 import service_account

# If modifying these scopes, delete the file token.json.
SCOPES = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
]

FOLDER_ID = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
try:
    SERVICE_ACCOUNT_FILE = "audio_player_api/service_key.json"
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
except FileNotFoundError:
    SERVICE_ACCOUNT_FILE = None
    creds = None
    print("Creds file not found.")


def get_file_list():
    """Shows basic usage of the Drive v3 API.
    Prints the names and ids of the first 10 files the user has access to.
    """
    try:
        service = build("drive", "v3", credentials=creds)

        # Call the Drive v3 API
        folder_id = FOLDER_ID
        mime_type = "audio/mpeg"
        results = (
            service.files()
            .list(
                q="'" + folder_id + "' in parents and mimeType='" + mime_type + "'",
                fields="nextPageToken, files(id, name)",
            )
            .execute()
        )
        items = results.get("files", [])

        if not items:
            print("No files found.")
            return

    except HttpError as error:
        # TODO(developer) - Handle errors from drive API.
        print(f"An error occurred: {error}")
        return []
    return items


def get_file(real_file_id):
    try:
        service = build("drive", "v3", credentials=creds)
        file_id = real_file_id
        result = service.files().get(fileId=file_id, fields="id, name").execute()
        # print(request)
        return result
    except HttpError as error:
        # TODO(developer) - Handle errors from drive API.
        print(f"An error occurred: {error}")
    return None


def download_file(real_file_id):
    try:
        service = build("drive", "v3", credentials=creds)

        file_id = real_file_id

        request = service.files().get_media(fileId=file_id)
        file = io.BytesIO()
        downloader = MediaIoBaseDownload(file, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print(f"Dowload {int(status.progress()) * 100 }.")
            error = False
            return file.getvalue(), error
            # yield file.getvalue()
    except HttpError as error:
        print(f"There was an error: {error}")
        file = None
        return file, error.reason

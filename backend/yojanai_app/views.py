from rest_framework.response import Response
from rest_framework.decorators import api_view
import base64
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import os
from dotenv import load_dotenv

load_dotenv()

REDIRECT_URI = f"https://api.notion.com/v1/oauth/authorize?client_id={os.getenv("NOTION_CLIENT_ID")}&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fonboarding%2Fuser%2Fconnect"

@api_view()
def upload_routine(request, *args, **kwargs):
    return Response(data={"message" : "Hello From Backend!!!"})

@csrf_exempt # For CSRF attacks
@require_POST
def notion_token_exchange(request):
    data = json.loads(request.body)
    code = data.get("code")

    if not code:
        return JsonResponse({"error": "Missing authorization code"}, status=400)

    token_url = "https://api.notion.com/v1/oauth/token"

    auth_str = f"{os.getenv("NOTION_CLIENT_ID")}:{os.getenv("NOTION_SECRET")}"
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth_str}",
        "Content-Type": "application/json",
    }

    body = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }

    response = requests.post(token_url, headers=headers, json=body)
    return JsonResponse(response.json(), status=response.status_code)

def exchange_code(request):
    code = request.data.get("code")
    redirect_uri = "http://localhost:3000/onboarding/user/connect"

    data = {
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }

    res = requests.post("https://oauth2.googleapis.com/token", data=data)
    tokens = res.json()
    print(tokens)

    # Save tokens['access_token'], tokens['refresh_token'] securely
    return Response(tokens)

# This is test view
def create_google_event(access_token):
    url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    event_data = {
        "summary": "AI-generated schedule: Deep Work",
        "description": "2-hour deep work session",
        "start": {
            "dateTime": "2025-06-07T10:00:00+05:45",  # Nepal time example
            "timeZone": "Asia/Kathmandu"
        },
        "end": {
            "dateTime": "2025-06-07T12:00:00+05:45",
            "timeZone": "Asia/Kathmandu"
        },
    }

    response = requests.post(url, headers=headers, json=event_data)

    if response.status_code == 200 or response.status_code == 201:
        return response.json()
    else:
        print("Error:", response.json())
        return None
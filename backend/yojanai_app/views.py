from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import base64
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from .subjectlistextractor import SubjectListExtraction
from  .scheduler import WeeklyScheduler

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")


load_dotenv()

REDIRECT_URI = "http://localhost:3000/onboarding/user/connect"


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

    auth_str = f"{os.getenv('NOTION_CLIENT_ID')}:{os.getenv('NOTION_SECRET')}"
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
            "dateTime": "2025-06-07T10:00:00+05:45",
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


@api_view(['POST'])
def weekly_sheduler(request):
    try:
        subjects = request.data.get('subjects', [])
        if not subjects:
            return Response({"error": "No subjects provided"}, status=400)

        scheduler = WeeklyScheduler(subjects=subjects)
        result = scheduler.solve_schedule()
        if result:        
            json_result = scheduler.schedule_to_json(result)
            return Response({"message": "Schedule generated", "data": json_result})
        else:
            return Response({"message" : "Schedule generated", "data" : "Unable to generate schedule try again later"})
    except Exception as e:
        # Temporary: catch and see the error message
        return Response({"error": str(e)}, status=500)
    

# Subject List Extractor Endpoint
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
@api_view(['GET'])
def subject_extractor(request):
    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "Email not provided"}, status=400)

    file_path = f"{email}/subjectList.png"  # or .jpg/.pdf etc based on how you store

    try:
        # Get signed URL to download the file
        signed_url_data = supabase.storage.from_("user_docs").create_signed_url(file_path, 60)
        signed_url = signed_url_data.get("signedURL")

        if not signed_url:
            return JsonResponse({"error": "Could not get signed URL"}, status=404)

        # Download file to temp location
        response = requests.get(signed_url)
        if response.status_code != 200:
            return JsonResponse({"error": "Failed to download file from Supabase"}, status=500)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name

        # Process image using your OCR class
        extractor = SubjectListExtraction(temp_file_path)
        extractor.image_pre_processing()
        extracted_json = extractor.create_json_format()

        # Clean up temp file
        os.remove(temp_file_path)

        return JsonResponse({"data": extracted_json}, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

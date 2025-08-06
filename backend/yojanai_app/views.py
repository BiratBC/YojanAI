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
from django.views.decorators.http import require_http_methods
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from .subjectlistextractor import SubjectListExtraction
from  .scheduler import WeeklyScheduler
import tempfile
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

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

@api_view(['POST'])
def weekly_sheduler(request):
    try:
        subjects = request.data.get('subjects', [])
        # print(subjects)
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
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
@csrf_exempt
@require_http_methods(["GET"])
def subject_extractor(request):
    email = request.GET.get("email")
    if not email:
        return _cors(JsonResponse({"error": "Email parameter is required"}, status=400))

    sanitized_email = email.replace("@", "_").replace(".", "_")
    file_path = f"{sanitized_email}/subjectList.png"

    # Try to generate signed or public URL
    signed_url = None
    try:
        signed_resp = supabase.storage.from_("userdocs").create_signed_url(file_path, 60)
        signed_url = signed_resp.get("signedURL") or signed_resp.get("signed_url") or signed_resp.get("url")
    except Exception:
        try:
            public_resp = supabase.storage.from_("userdocs").get_public_url(file_path)
            signed_url = public_resp.get("publicURL") or public_resp.get("public_url") or public_resp.get("url")
        except Exception as e:
            return _cors(JsonResponse({"error": f"Unable to get file URL: {str(e)}"}, status=500))

    if not signed_url:
        return _cors(JsonResponse({"error": "Could not generate file URL"}, status=500))

    # Download the image
    try:
        r = requests.get(signed_url, stream=True)
        if r.status_code != 200:
            return _cors(JsonResponse({"error": "File not accessible", "status_code": r.status_code}, status=500))

        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
            for chunk in r.iter_content(chunk_size=8192):
                temp_file.write(chunk)
            temp_file_path = temp_file.name
    except Exception as e:
        return _cors(JsonResponse({"error": f"Error downloading file: {str(e)}"}, status=500))

    # Run OCR
    try:
        extractor = SubjectListExtraction(temp_file_path)
        extractor.image_pre_processing()
        extracted_json = extractor.create_json_format()
    except Exception as e:
        os.remove(temp_file_path)
        return _cors(JsonResponse({"error": f"OCR failed: {str(e)}"}, status=500))

    os.remove(temp_file_path)
    return _cors(JsonResponse({"data": extracted_json}, safe=False))


# Helper to add CORS headers to any response
def _cors(response):
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response
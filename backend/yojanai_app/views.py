from rest_framework.response import Response
from rest_framework.decorators import api_view
import json

@api_view()
def upload_routine(request, *args, **kwargs):
    return Response(data={"message" : "Hello From Backend!!!"})


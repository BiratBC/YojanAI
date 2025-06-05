from django.urls import path

from . import views

urlpatterns = [
    path('', views.upload_routine),
    path('notion/exchange-code/', views.notion_token_exchange),
    path('google/exchange-code/', views.exchange_code),
    path('google/create-event/', views.create_google_event)

]
from django.urls import path
from . import views

urlpatterns = [
    path('health-check/', views.health_check, name='health-check'),
    path('stats/', views.StatsView.as_view(), name='stats'),
    path('contact/', views.ContactView.as_view(), name='contact'),
]

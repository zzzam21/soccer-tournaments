from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from .serializers import TeamSerializer
from rest_framework import generics
from .models import Team

class Teams(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
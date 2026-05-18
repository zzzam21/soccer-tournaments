from django.shortcuts import render
from .serializers import TournamentSerializer
from rest_framework import generics

from .models import Tournament
# Create your views here.

class Tournaments(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

class TournamentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
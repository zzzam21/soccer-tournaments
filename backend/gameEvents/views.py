from django.shortcuts import render
from rest_framework import generics
from gameEvents.models import GameEvent
from .serializers import GameEventSerializer


class GameEventViewSet(generics.ListCreateAPIView):
    queryset =  GameEvent.objects.all()
    serializer_class = GameEventSerializer
# Create your views here.
class GameEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GameEvent.objects.all()
    serializer_class = GameEventSerializer  

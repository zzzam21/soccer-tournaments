from django.shortcuts import render
from rest_framework import generics
from player.models import Player
from .serializers import PlayerSerializer
    

class PlayerViewSet(generics.ListCreateAPIView  ):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class PlayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
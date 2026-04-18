from django.shortcuts import render
from rest_framework import generics
from game.models import Game
from game.serializers import GameSerializer

# Create your views here
class GameViewSet(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    
class GameDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

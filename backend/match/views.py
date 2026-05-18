from django.shortcuts import render
from rest_framework import generics
from match.models import Match
from match.serializers import MatchSerializer

class MatchViewSet(generics.ListCreateAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    
class MatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
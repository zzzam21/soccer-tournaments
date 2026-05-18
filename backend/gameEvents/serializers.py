from rest_framework import serializers
from .models import GameEvent


class GameEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameEvent
        fields = '__all__'
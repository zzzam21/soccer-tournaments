from rest_framework import serializers


class StatsSerializer(serializers.Serializer):
    total_tournaments = serializers.IntegerField()
    total_teams = serializers.IntegerField()
    total_players = serializers.IntegerField()
    total_matches = serializers.IntegerField()
    total_games = serializers.IntegerField()
    total_goals = serializers.IntegerField()
    ongoing_tournaments = serializers.IntegerField()
    completed_tournaments = serializers.IntegerField()

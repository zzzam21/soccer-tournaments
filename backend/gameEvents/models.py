from django.db import models


class GameEvent(models.Model):
    typeEvent = models.CharField(max_length=50)
    minute = models.IntegerField()
    game = models.ForeignKey('game.Game', on_delete=models.CASCADE, related_name='events')
    player = models.ForeignKey('player.Player', on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return f"{self.typeEvent} - min {self.minute}"

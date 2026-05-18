# Generated manually — fix gameEvents.GameEvent to reference game.Game instead of the
# now-deleted internal gameEvents.Game model.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gameEvents', '0001_initial'),
        ('game', '0001_initial'),
        ('player', '0001_initial'),
    ]

    operations = [
        # 1. Add a temporary nullable FK pointing to the real game.Game
        migrations.AddField(
            model_name='gameevent',
            name='game_new',
            field=models.ForeignKey(
                null=True,
                blank=True,
                on_delete=django.db.models.deletion.CASCADE,
                to='game.game',
                related_name='events',
            ),
        ),

        # 2. Drop the old FK that pointed to gameEvents.Game
        migrations.RemoveField(
            model_name='gameevent',
            name='game',
        ),

        # 3. Delete the orphan gameEvents.Game model
        migrations.DeleteModel(
            name='Game',
        ),

        # 4. Rename game_new → game and make it non-nullable
        migrations.RenameField(
            model_name='gameevent',
            old_name='game_new',
            new_name='game',
        ),
        migrations.AlterField(
            model_name='gameevent',
            name='game',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='game.game',
                related_name='events',
            ),
        ),

        # 5. Add related_name to player FK as well
        migrations.AlterField(
            model_name='gameevent',
            name='player',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='player.player',
                related_name='events',
            ),
        ),
    ]

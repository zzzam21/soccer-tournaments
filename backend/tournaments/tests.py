from django.test import TestCase
from django.urls import reverse

from .models import Tournament

# Create your tests here.
class TournamentTest(TestCase):
    def setUp(self):
        Tournament.objects.create(
            name="Copa América",
            city="Buenos Aires",
            type="International",
            status="Completed",
            start_date="2021-06-13",
            end_date="2021-07-10"
        )

    def test_tournament_str(self):
        tournament = Tournament.objects.get(name="Copa América")
        self.assertEqual(str(tournament), "Copa América")

    def test_tournament_list_view(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Copa América")

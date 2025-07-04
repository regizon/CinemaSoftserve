from cProfile import Profile

from django.http import Http404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import generics, viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.permissions import AllowAny
from cinema.models import Movie, Booking, Genre, User, Session, StatusChoices, Actor
from cinema.public_api.serializers import (
    MovieSerializer,
    BookingSerializer,
    ActorSerializer,
    GenreSerializer,
    RegisterSerializer,
    SessionSerializer,
    BookingCancelSerializer,
    ProfileSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
import requests



class PublicMovieViewset(viewsets.ReadOnlyModelViewSet):
    serializer_class = MovieSerializer
    lookup_field = 'uuid'

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = {
        'genres__genre_name': ['exact'],
        'year': ['exact', 'gte', 'lte'],
        'language': ['exact'],
    }
    ordering_fields = ['year', 'title']
    search_fields = ['title', 'original_title', 'slogan']

    def get_queryset(self):
        now = timezone.now()
        Movie.objects.filter(is_active=True, active_until__lt=now).update(is_active=False)
        return Movie.objects.filter(is_active=True).prefetch_related('genres')

    @action(methods=['get'], detail=False)
    def genres(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)
    
class PublicUserBooking(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class CancelBookingView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()
    serializer_class = BookingCancelSerializer

    def get_object(self):
        try:
            booking = super().get_object()
        except Http404:
            raise NotFound(detail="Бронювання не знайдено", code="booking_not_found")

        if booking.user != self.request.user:
            raise ValidationError("Бронювання належить іншому користувачу", code="not_owner")

        if booking.session.start_time <= timezone.now():
            raise ValidationError("Неможливо скасувати: сеанс вже почався/завершився", code="too_late_to_cancel")

        return booking

    def perform_update(self, serializer):
        serializer.save(status=StatusChoices.CANCELLED)

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        return Response({"success": "Бронювання скасовано"})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class PublicSessionViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class CheckProfile(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user
      
class PublicActorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer

class ActorInfoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            actor = Actor.objects.get(pk=pk)
        except Actor.DoesNotExist:
            raise NotFound("Актор не знайдений у базі")

        # Пошук по TMDb
        tmdb_search_url = "https://api.themoviedb.org/3/search/person"
        tmdb_response = requests.get(tmdb_search_url, params={
            "api_key": "8c71ea1bfc74c564ee45a3cbd6bec2ab",
            "query": actor.actor_name,
            "language": "uk-UA"
        })

        if tmdb_response.status_code != 200:
            return Response({"error": "Помилка при запиті до TMDb"}, status=500)

        results = tmdb_response.json().get("results")
        if not results:
            return Response({"error": "TMDb не знайшов актора"}, status=404)

        actor_data = results[0]
        tmdb_id = actor_data["id"]

        # Детальна інфа про актора
        details_url = f"https://api.themoviedb.org/3/person/{tmdb_id}"
        details_response = requests.get(details_url, params={
            "api_key": "8c71ea1bfc74c564ee45a3cbd6bec2ab",
            "language": "uk-UA"
        })

        if details_response.status_code != 200:
            return Response({"error": "Помилка при отриманні деталей"}, status=500)

        details = details_response.json()

        return Response({
            "імʼя": actor.actor_name,
            "біографія": details.get("biography"),
            "дата_народження": details.get("birthday"),
            "місце_народження": details.get("place_of_birth"),
            "імʼя_англ": details.get("name"),
            "популярність": details.get("popularity"),
            "фото": f"https://image.tmdb.org/t/p/w500{details['profile_path']}" if details.get("profile_path") else None,
            "imdb_url": f"https://www.imdb.com/name/{details['imdb_id']}" if details.get("imdb_id") else None
        })
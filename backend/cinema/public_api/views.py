from django.http import Http404
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import generics, viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.permissions import AllowAny
from cinema.models import Movie, Booking, Genre, User, Session, StatusChoices, Actor, Director
from cinema.public_api.serializers import (
    CustomTokenObtainPairSerializer,
    BookingSerializer,
    ActorSerializer,
    GenreSerializer,
    RegisterSerializer,
    SessionSerializer,
    BookingCancelSerializer,
    ProfileSerializer,
    DirectorSerializer,
    BaseMovieSerializer,
    ManualMovieSerializer
)

from django_filters.rest_framework import DjangoFilterBackend
import requests
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from cinema.utils import email_confirmation_token
from django.core.mail import send_mail



class PublicMovieViewset(viewsets.ReadOnlyModelViewSet):
    serializer_class = BaseMovieSerializer
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
        return Movie.objects.filter(is_active=True).prefetch_related('genres', 'actors', 'directors')


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
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)
        email = serializer.save(is_active=False)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = email_confirmation_token.make_token(user)
        domain = get_current_site(self.request).domain

        confirm_url = f"http://{domain}/api/v1/confirm-email/{uid}/{token}/"

        send_mail(
            subject='Підтвердіть ваш email',
            message=f'Перейдіть за посиланням для підтвердження: {confirm_url}',
            from_email='noreply@cinema.com',
            recipient_list=[user.email],
            fail_silently=False
        )

class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Невірний UID"}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return Response({"message": "Користувач вже підтверджений"}, status=status.HTTP_200_OK)

        if email_confirmation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Email підтверджено успішно!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Недійсний або прострочений токен"}, status=status.HTTP_400_BAD_REQUEST)

class PublicSessionViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['movie', 'hall']
    ordering_fields = ['start_time']
    ordering = ['start_time']

    def get_queryset(self):
        return super().get_queryset()
        # from django.utils import timezone
        # queryset = queryset.filter(start_time__gte=timezone.now())
        # return queryset
class CheckProfile(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        return self.request.user
      
class PublicActorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer


class MovieSessions(generics.ListAPIView):
    serializer_class = SessionSerializer

    def get_queryset(self):
        movie_id = self.kwargs['movie_id']

        try:
            movie = Movie.objects.get(id=movie_id, is_active=True)
        except Movie.DoesNotExist:
            raise Http404("Такого фільму не знайдено або він не активний")

        return Session.objects.filter(movie_id=movie_id)

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
    
class AllEntitiesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        actors = Actor.objects.all()
        genres = Genre.objects.all()
        directors = Director.objects.all()

        return Response({
            "actors": ActorSerializer(actors, many=True).data,
            "genres": GenreSerializer(genres, many=True).data,
            "directors": DirectorSerializer(directors, many=True).data
        })
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
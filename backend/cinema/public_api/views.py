from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import generics, viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from cinema.models import Movie, Booking, Genre, User, Session, StatusChoices, Actor
from cinema.public_api.serializers import MovieSerializer, BookingSerializer, ActorSerializer , GenreSerializer, RegisterSerializer, \
    SessionSerializer, BookingCancelSerializer
from django_filters.rest_framework import DjangoFilterBackend



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
        booking = super().get_object()

        if booking.user != self.request.user:
            raise ValidationError("Бронювання належить іншому користувачу")

        if booking.session.start_time <= timezone.now():
            raise ValidationError("Неможливо скасувати: сеанс вже почався/завершився")

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

class PublicActorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer

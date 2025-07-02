from cProfile import Profile

from django.http import Http404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework import generics, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound
from cinema.models import Movie, Booking, Genre, User, Session, StatusChoices
from cinema.public_api.serializers import MovieSerializer, BookingSerializer, GenreSerializer, RegisterSerializer, \
    SessionSerializer, BookingCancelSerializer, ProfileSerializer


class PublicMovieViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.filter(is_active=True)\
                            .prefetch_related('genres')
    serializer_class = MovieSerializer

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

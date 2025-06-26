from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from cinema.models import Movie, Booking, Genre, User, Session
from cinema.public_api.serializers import MovieSerializer, BookingSerializer, GenreSerializer, RegisterSerializer, \
    SessionSerializer


class PublicMovieViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.filter(is_active=True)
    serializer_class = MovieSerializer

    @action(methods=['get'], detail=False)
    def genres(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)

class PublicUserBooking(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class PublicSessionViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
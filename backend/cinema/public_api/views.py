from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from cinema.models import Movie, Booking, Genre, User
from cinema.public_api.serializers import MovieSerializer, BookingSerializer, GenreSerializer, RegisterSerializer

from django.views.generic import TemplateView

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

class IndexView(TemplateView):
    template_name = 'main/index.html'
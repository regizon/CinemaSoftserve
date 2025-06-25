from django.db import transaction
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.shortcuts import render


from cinema.models import Movie, Booking, Genre, Session
from cinema.public_api.serializers import MovieSerializer, BookingSerializer, GenreSerializer, SessionSerializer


class PublicMovieViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.filter(is_active=True)
    serializer_class = MovieSerializer

    @action(methods=['get'], detail=False)
    def genres(self, request):
        genres = Genre.objects.all()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)


class PublicSessionViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class PublicUserBooking(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


def index(request):
    return render(request, 'main/index.html')
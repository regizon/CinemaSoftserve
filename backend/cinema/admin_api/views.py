from rest_framework import viewsets, generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from cinema.utils import TMDBParser
from cinema.admin_api.serializers import MovieSearchSerializer
from cinema.models import Movie, Session, Booking, Genre, Hall, Director, Actor, MovieGenre, MovieActor, MovieDirector
from cinema.public_api.serializers import ManualMovieSerializer, SessionSerializer, BookingSerializer, GenreSerializer, \
    HallSerializer, DirectorSerializer, ActorSerializer, BaseMovieSerializer, ParserMovieSerializer

class AdminMovieViewset(viewsets.ModelViewSet):
    queryset = Movie.objects.all().order_by('id')
    permission_classes = (IsAdminUser,)
    serializer_class = ManualMovieSerializer

class AdminSessionViewset(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (IsAdminUser,)

class AdminBookingViewset(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = (IsAdminUser,)

class AdminGenreViewset(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = (IsAdminUser,)

class AdminHallViewset(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = (IsAdminUser,)

class AdminDirectorViewset(viewsets.ModelViewSet):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    permission_classes = (IsAdminUser,)


class AdminActorViewset(viewsets.ModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    permission_classes = (IsAdminUser,)


class FindFilm(APIView):
    permission_classes = (IsAdminUser,)

    def post(self, request):
        title = request.data.get("title")
        year = int(request.data.get("year"))

        parser = TMDBParser(title, year)
        try:
            data = parser.parse_and_return_data()
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)



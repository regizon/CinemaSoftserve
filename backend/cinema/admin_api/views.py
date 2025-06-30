from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from cinema.models import Movie, Session, Booking, Genre, Hall, Director, Actor
from cinema.public_api.serializers import MovieSerializer, SessionSerializer, BookingSerializer, GenreSerializer, \
    HallSerializer, DirectorSerializer, ActorSerializer
from cinema.admin_api.Utils.pagination import AdminPagination

class AdminMovieViewset(viewsets.ModelViewSet):
    queryset = Movie.objects.all().order_by('id')
    serializer_class = MovieSerializer
    permission_classes = (IsAdminUser,)
    pagination_class = AdminPagination

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

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from cinema.models import Movie
from cinema.public_api.serializers import MovieSerializer


class AdminMovieViewset(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = (IsAdminUser,)
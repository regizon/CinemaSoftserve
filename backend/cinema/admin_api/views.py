from rest_framework import viewsets, generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser

from cinema.admin_api.serializers import MovieSearchSerializer
from cinema.models import Movie, Session, Booking, Genre, Hall, Director, Actor, MovieGenre, MovieActor, MovieDirector
from cinema.public_api.serializers import ManualMovieSerializer, SessionSerializer, BookingSerializer, GenreSerializer, \
    HallSerializer, DirectorSerializer, ActorSerializer, BaseMovieSerializer
import requests

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


class FindFilm(generics.CreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSearchSerializer
    #permission_classes = (IsAdminUser,)


    def perform_create(self, serializer):
        input_title = self.request.data.get('title')
        year = int(self.request.data.get('year'))
        if Movie.objects.filter(title=input_title, year=year).exists():
            raise ValidationError("Movie already exists")
        headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YmJjMTg4ODA2NDYyOWM2Y2Q1MTQxYTM5OWU1ODE3NiIsIm5iZiI6MTc1MTM1OTE5NS42MzkwMDAyLCJzdWIiOiI2ODYzOWVkYjA3OWQyNjJiMGY0MTQ2NjEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8NGfy4mRS7wnLdzgmlvpnh_Echon1e6ZH_CMiM6lCEg"
        }

        age = None
        trailer_url = None

        age_ratings = {
            "G": 0,
            "PG": 6,
            "PG-13": 13,
            "R": 16,
            "NC-17": 18
        }
        url = f"https://api.themoviedb.org/3/search/movie?query={input_title}&include_adult=false&language=en-US&primary_release_year={year}&page=1"

        id_response = requests.get(url, headers=headers)
        movie_id = id_response.json()['results'][0]['id']

        details_url = f"https://api.themoviedb.org/3/movie/{movie_id}?language=uk-UA"
        age_response = f"https://api.themoviedb.org/3/movie/{movie_id}/release_dates"

        age_data = requests.get(age_response, headers=headers).json()
        for country in age_data['results']:
            if country['iso_3166_1'] == 'US':
                country_data = country['release_dates']
                for data in country_data:
                    if data['type'] == 3 or data['type'] == 5:
                        age = data['certification']

        video_response = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}/videos?language=en-US", headers=headers)
        video_data = video_response.json()


        for json in video_data['results']:
            if json['site'] == "YouTube" and json['type'] == "Trailer" and json['official'] == True:
                key = json['key']
                trailer_url = f"https://www.youtube.com/embed/{key}"
                break

        details_response = requests.get(details_url, headers=headers)
        json_data = details_response.json()

        duration = json_data['runtime']
        description = json_data['overview']
        title = json_data['title']
        image_path = json_data['backdrop_path']
        poster_path = json_data['poster_path']
        country = json_data['origin_country'][0]
        original_title = json_data['original_title']
        genre_list = []
        for genre in json_data['genres']:
            genre_list.append(genre['name'])

        credits_response = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}/credits?language=uk-UA",
                                        headers=headers)
        director_name = None
        actor_list = []
        credits_json = credits_response.json()

        for data in credits_json['crew']:
            if data['job'] == 'Director':
                director_name = data['name']
                break

        for data in credits_json['cast']:
            if data['known_for_department'] == 'Acting':
                if len(actor_list) < 3:
                    actor_list.append(data['name'])
                else:
                    break

        image_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
        poster_url = f"https://image.tmdb.org/t/p/w300{image_path}"

        age_rate = age_ratings.get(age, 0)

        movie_data = {
            "title":input_title,
            "slogan":original_title,
            "original_title": original_title,
            "description": description,
            "country":country,
            "year":year,
            "age_rate": age_rate,
            "language": "Українська",
            "duration_minutes": duration,
            "img_url": image_url,
            "poster_url": poster_url,
            "trailer_url": trailer_url or "https://www.youtube.com",
            "genres": genre_list,
            "actors": actor_list,
            "director_name": director_name
        }

        movie_serializer = MovieSerializer(data=movie_data)
        movie_serializer.is_valid(raise_exception=True)
        movie_serializer.save()



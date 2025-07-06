# cinema/utils.py
import requests
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException, ValidationError
from rest_framework import status

from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from cinema.models import Actor, MovieActor, Director, MovieDirector, MovieGenre, Genre, Movie
from cinema.public_api.serializers import ParserMovieSerializer


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_code = 'error'

        if hasattr(exc, 'get_codes'):
            codes = exc.get_codes()
            if isinstance(codes, dict):
                if len(codes) == 1:
                    field, field_codes = next(iter(codes.items()))
                    if isinstance(field_codes, (list, tuple)) and len(field_codes) == 1:
                        error_code = field_codes[0]
                    else:
                        error_code = str(codes)
                else:
                    error_code = str(codes)
            elif isinstance(codes, (list, tuple)) and len(codes) == 1:
                error_code = codes[0]
            else:
                error_code = str(codes)
        elif isinstance(exc, APIException):
            error_code = exc.default_code

        if isinstance(response.data, dict):
            response.data['error_code'] = error_code
        else:
            response.data = {
                'detail': response.data,
                'error_code': error_code
            }

    return response


class EmailConfirmationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            str(user.pk) + str(timestamp) + str(user.is_active)
        )

email_confirmation_token = EmailConfirmationTokenGenerator()

class TMDBParser:
    def __init__(self, title: str, year: int):
        self.title = title
        self.year = year
        self.api_key = "ВАШ_ТОКЕН"
        self.headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YmJjMTg4ODA2NDYyOWM2Y2Q1MTQxYTM5OWU1ODE3NiIsIm5iZiI6MTc1MTM1OTE5NS42MzkwMDAyLCJzdWIiOiI2ODYzOWVkYjA3OWQyNjJiMGY0MTQ2NjEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8NGfy4mRS7wnLdzgmlvpnh_Echon1e6ZH_CMiM6lCEg"
        }
        self.movie_id = None

    age_ratings = {
        "G": 0,
        "PG": 6,
        "PG-13": 13,
        "R": 16,
        "NC-17": 18
    }

    def check_exist(self):
        if Movie.objects.filter(title=self.title, year=self.year).exists():
            raise ValidationError("Movie already exists")

    def get_id(self):
        id_response = requests.get(f"https://api.themoviedb.org/3/search/movie?query={self.title}&include_adult=false&language=en-US&primary_release_year={self.year}&page=1", headers=self.headers)
        movie_id = id_response.json()['results'][0]['id']
        self.movie_id = movie_id

    def get_movie(self):
        details_url = f"https://api.themoviedb.org/3/movie/{self.movie_id}?language=uk-UA"
        return requests.get(details_url, headers=self.headers).json()

    def fetch_age_rating(self):
        url = f"https://api.themoviedb.org/3/movie/{self.movie_id}/release_dates"
        response = requests.get(url, headers=self.headers).json()
        for country in response['results']:
            if country['iso_3166_1'] == 'US':
                for data in country['release_dates']:
                    if data['type'] in (3, 5):
                        return data['certification']
        return None

    def fetch_trailer_url(self):
        url = f"https://api.themoviedb.org/3/movie/{self.movie_id}/videos?language=en-US"
        videos = requests.get(url, headers=self.headers).json()
        for v in videos['results']:
            if v['site'] == "YouTube" and v['type'] == "Trailer" and v['official']:
                return f"https://www.youtube.com/embed/{v['key']}"
        return "https://www.youtube.com"

    def fetch_credits(self):
        url = f"https://api.themoviedb.org/3/movie/{self.movie_id}/credits?language=uk-UA"
        data = requests.get(url, headers=self.headers).json()
        director = next((c['name'] for c in data['crew'] if c['job'] == 'Director'), None)
        actors = [a['name'] for a in data['cast'] if a['known_for_department'] == 'Acting'][:3]
        return director, actors

    def parse_and_save(self):
        self.check_exist()
        self.get_id()
        json_data = self.get_movie()
        age = self.fetch_age_rating()

        age_ratings = {
            "G": 0,
            "PG": 6,
            "PG-13": 13,
            "R": 16,
            "NC-17": 18
        }

        trailer_url = self.fetch_trailer_url()
        director_name, actors = self.fetch_credits()

        image_url = f"https://image.tmdb.org/t/p/w500{json_data['poster_path']}"
        poster_url = f"https://image.tmdb.org/t/p/w300{json_data['backdrop_path']}"

        movie_data = {
            "title": self.title,
            "slogan": json_data['original_title'],
            "original_title": json_data['original_title'],
            "description": json_data['overview'],
            "country": json_data['origin_country'][0],
            "year": self.year,
            "age_rate": age_ratings.get(age, 0),
            "language": "Українська",
            "duration_minutes": json_data['runtime'],
            "img_url": image_url,
            "poster_url": poster_url,
            "trailer_url": trailer_url,
            "genres": [g['name'] for g in json_data['genres']],
            "actors": actors,
            "director_name": director_name
        }

        serializer = ParserMovieSerializer(data=movie_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer.data
# cinema/utils.py
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status

from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from cinema.models import Actor, MovieActor, Director, MovieDirector, MovieGenre, Genre


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

class MovieRelationMixin:
    def _assign_relations(self, movie, actors, directors, genres, create_if_missing=False):
        self._add_relation(actors, Actor, MovieActor, 'actor_name', 'actor', movie, create_if_missing)
        self._add_relation(directors, Director, MovieDirector, 'director_name', 'director', movie, create_if_missing)
        self._add_relation(genres, Genre, MovieGenre, 'genre_name', 'genre', movie, create_if_missing)

    def _add_relation(self, items, model_class, through_model, lookup_field, related_field, movie, create_if_missing):
        for item in items:
            try:
                if create_if_missing: # Якщо додавати нові дані - запит прийшов з парсеру
                    instance, _ = model_class.objects.get_or_create(**{lookup_field: item})
                else: # Шукаємо за айді, якщо через форму руками
                    instance = model_class.objects.get(id=item)
                through_model.objects.get_or_create(movie=movie, **{related_field: instance})
            except model_class.DoesNotExist:
                continue
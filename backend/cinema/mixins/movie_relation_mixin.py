from cinema.models import Actor, MovieActor, Director, MovieDirector, Genre, MovieGenre


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
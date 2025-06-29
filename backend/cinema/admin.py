from django.contrib import admin
from .models import User, Movie, Genre, MovieGenre, Hall, Session, Booking, Actor, Director, MovieDirector, MovieActor

admin.site.register(User)
admin.site.register(Movie)
admin.site.register(Genre)
admin.site.register(MovieGenre)
admin.site.register(Hall)
admin.site.register(Session)
admin.site.register(Booking)
admin.site.register(Actor)
admin.site.register(Director)
admin.site.register(MovieActor)
admin.site.register(MovieDirector)
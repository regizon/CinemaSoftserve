from django.contrib import admin
from .models import User, Role, Movie, Genre, MovieGenre, Hall, Session, Status, Booking

admin.site.register(User)
admin.site.register(Role)
admin.site.register(Movie)
admin.site.register(Genre)
admin.site.register(MovieGenre)
admin.site.register(Hall)
admin.site.register(Session)
admin.site.register(Status)
admin.site.register(Booking)
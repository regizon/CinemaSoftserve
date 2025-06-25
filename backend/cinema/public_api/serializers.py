from rest_framework import serializers

from cinema.models import Movie, Booking, Genre, Session, Hall, Director, Actor, StatusChoices


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate_session(self, session):
        booked_seats = Booking.objects.filter(session=session).count()
        hall_capacity = session.hall.capacity
        if booked_seats >= hall_capacity:
            raise serializers.ValidationError("На обраний вами сеанс немає вільних місць")
        return session

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class SessionSerializer(serializers.ModelSerializer):
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = '__all__'

    def get_available_seats(self, obj):
        total = obj.hall.capacity
        booked = Booking.objects.filter(session=obj, status=StatusChoices.BOOKED).count()
        return total - booked


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = '__all__'

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = '__all__'


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'


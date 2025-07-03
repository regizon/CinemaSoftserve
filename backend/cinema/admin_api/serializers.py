from rest_framework import serializers

from cinema.models import Movie, Booking


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class MovieSearchSerializer(serializers.Serializer):
    title = serializers.CharField()
    year = serializers.IntegerField()
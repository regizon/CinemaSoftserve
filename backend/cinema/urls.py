from django.urls import path, include

from cinema.admin_api.views import AdminMovieViewset
from cinema.public_api.views import PublicMovieViewset, PublicUserBooking
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'public/movies', PublicMovieViewset,basename='public')
router.register(r'admin/movies', AdminMovieViewset, basename='admin')
urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/bookings', PublicUserBooking.as_view())
]
# urlpatterns = [
#     path('api/v1/movies', PublicMovieApiView.as_view()),
#     path('api/v1/movies/<int:pk>/', PublicMovieDetailsApiView.as_view()),
#     path('api/v1/bookings', PublicUserBooking.as_view()),
# ]
from django.urls import path, include
from cinema.public_api.views import index, PublicSessionViewset
from cinema.admin_api.views import AdminMovieViewset, AdminBookingViewset, AdminSessionViewset, AdminHallViewset, \
    AdminActorViewset, AdminDirectorViewset
from cinema.public_api.views import PublicMovieViewset, PublicUserBooking
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'public/movies', PublicMovieViewset)
router.register(r'public/sessions', PublicSessionViewset)
router.register(r'admin/movies', AdminMovieViewset, basename='admin')
router.register(r'admin/sessions', AdminSessionViewset, basename='admin_sessions')
router.register(r'admin/bookings', AdminBookingViewset)
router.register(r'admin/halls', AdminHallViewset)
router.register(r'admin/actors', AdminActorViewset)
router.register(r'admin/directors', AdminDirectorViewset)
urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/bookings/', PublicUserBooking.as_view()),
    path('', index, name='index'),
]

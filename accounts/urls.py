from django.urls import path
from . import views

urlpatterns = [
    path('', views.signup, name='signup'),
    path('home/', views.home, name='home'),
    path('itinerary/', views.itinerary, name='itinerary'),
    path('forgot_pass/', views.forgot_pass, name='forgot_pass'),
    path('city_picker/', views.city_picker, name='city_picker'),
    path('activities/', views.activities, name='activities'),
    path('budget/', views.budget, name='budget'),
]
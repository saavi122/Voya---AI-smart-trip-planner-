from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html')

def signup(request):
    return render(request, 'signup.html')

def itinerary(request):
    return render(request, 'itinerary.html')

def forgot_pass(request):
    return render(request, 'forgot_pass.html')

def city_picker(request):
    return render(request, 'city_picker.html')

def activities(request):
    return render(request, 'activities.html') 

def budget(request):
    return render(request, 'budget.html')
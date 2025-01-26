from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.contrib.auth import logout, login
from django.shortcuts import render

def pomodoro_timer(request):
    return render(request, "popup.html")


@login_required
def home(request):
 return render(request, "home.html", {})


def profile_view(request):
 avatar_name = request.session.get('avatar_name', 'Default Avatar')
 return render(request, 'profile.html', {'avatar_name': avatar_name})



def custom_logout(request):
 logout(request)  # Logs out the user
 return redirect('/')

def authView(request):
 if request.method == "POST":
  form = UserCreationForm(request.POST or None)


  if form.is_valid():
   user = form.save()
   email = request.POST.get('email')
   first_name = request.POST.get('first_name')

   # Save the email manually in the User model
   user.email = email  # Ensure the email is saved in the User model
   user.save()

   user.first_name = first_name
   user.save()

   form.save()

   login(request, user)
   return redirect("base:login")
 else:
  form = UserCreationForm()
 return render(request, "registration/signup.html", {"form": form})
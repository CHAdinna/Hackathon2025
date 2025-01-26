from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.contrib.auth import logout, login

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

  avatar_name = request.POST.get('avatar_name')
  if form.is_valid():
   user = form.save()
   email = request.POST.get('email')

   # Save the email manually in the User model
   user.email = email  # Ensure the email is saved in the User model
   user.save()

   if avatar_name:
    request.session['avatar_name'] = avatar_name  # Store avatar_name in session
   form.save()

   login(request, user)
   return redirect("base:login")
 else:
  form = UserCreationForm()
 return render(request, "registration/signup.html", {"form": form})
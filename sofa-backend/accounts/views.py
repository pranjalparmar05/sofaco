from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
import random
from .models import UserProfile

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists!'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    otp = str(random.randint(100000, 999999))
    
    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.otp = otp
    profile.save()

    # Email par OTP bhejna (abhi console par print hoga)
    send_mail(
        'Your SofaCraft OTP Code',
        f'Your verification OTP is {otp}',
        'noreply@sofacraft.com',
        [email],
        fail_silently=False,
    )

    return Response({'message': 'Registration successful. Check console/email for OTP.'})

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    entered_otp = request.data.get('otp')

    try:
        user = User.objects.get(email=email)
        profile = user.userprofile
        if profile.otp == entered_otp:
            profile.is_verified = True
            profile.otp = ''
            profile.save()

            # Automatic Login ke liye JWT Token generate karna
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful!',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username
            })
        else:
            return Response({'error': 'Invalid OTP'}, status=400)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth_serializers import RegisterSerializer


class RegisterView(APIView):
    throttle_classes = ()
    permission_classes = ()

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.save()
        return Response(
            {'token': token.key, 'username': serializer.validated_data['username']},
            status=status.HTTP_201_CREATED,
        )

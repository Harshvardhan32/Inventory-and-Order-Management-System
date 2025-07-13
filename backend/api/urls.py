from django.urls import path
from .views import (
    RegisterUserView,
    LoginUserView,
    ProductView,
    ProductDetailView,
    CustomerView,
    CustomerDetailView,
    OrderView,
    RecentOrdersView,
    OrderDetailView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/register/", RegisterUserView.as_view()),
    path("auth/login/", LoginUserView.as_view()),
    path("products/", ProductView.as_view()),
    path("products/<int:pk>/", ProductDetailView.as_view()),
    path("customers/", CustomerView.as_view()),
    path("customers/<int:pk>/", CustomerDetailView.as_view()),
    path("orders/", OrderView.as_view()),
    path("orders/<int:pk>/", OrderDetailView.as_view()),
    path("orders/recent/", RecentOrdersView.as_view()),
]

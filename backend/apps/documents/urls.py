from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListDocumentsAPIView.as_view(), name='document_list'),
    path('upload/', views.UploadDocumentAPIView.as_view(), name='document_upload'),
    path('<int:pk>/summarize/', views.SummarizeDocumentAPIView.as_view(), name='document_summarize'),
    path('<int:pk>/quiz/', views.GenerateQuizAPIView.as_view(), name='document_quiz'),
    path('<int:pk>/chat/', views.ChatDocumentAPIView.as_view(), name='document_chat'),
]

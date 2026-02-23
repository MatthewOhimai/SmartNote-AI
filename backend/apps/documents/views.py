from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Document, Quiz, ChatSession
from .serializers import DocumentSerializer, QuizSerializer, ChatSessionSerializer
from .services import extract_text_from_pdf, generate_summary, generate_quiz, chat_with_document
import logging

logger = logging.getLogger(__name__)


class ListDocumentsAPIView(APIView):
    """GET /api/documents/ — List all documents."""

    def get(self, request, *args, **kwargs):
        documents = Document.objects.all().order_by('-created_at')
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadDocumentAPIView(APIView):
    """POST /api/documents/upload/ — Upload a PDF and extract text."""

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # If title is not provided, extract it from the filename
        if not data.get('title') and 'file' in request.FILES:
            filename = request.FILES['file'].name
            # Remove extension for a cleaner title
            data['title'] = filename.rsplit('.', 1)[0]
            
        serializer = DocumentSerializer(data=data)
        if serializer.is_valid():
            document = serializer.save()

            # Delegate business logic (text extraction) to services layer
            try:
                extracted_text = extract_text_from_pdf(document.file.path)
                document.extracted_text = extracted_text
                document.save(update_fields=['extracted_text'])
            except Exception as e:
                logger.error(f"Text extraction failed for document {document.id}: {e}")

            return Response(DocumentSerializer(document).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SummarizeDocumentAPIView(APIView):
    """POST /api/documents/{id}/summarize/ — Generate AI summary."""

    def post(self, request, pk, *args, **kwargs):
        document = get_object_or_404(Document, pk=pk)

        if not document.extracted_text:
            return Response(
                {"error": "No extracted text available. Please upload and process a PDF first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Delegate AI logic to services layer
        try:
            summary_data = generate_summary(document.extracted_text)
        except (ValueError, EnvironmentError) as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Persist the short summary to the document
        document.summary = summary_data.get("short", "")
        document.save(update_fields=["summary"])

        return Response(
            {
                "document_id": document.id,
                "short_summary": summary_data.get("short", ""),
                "bullet_points": summary_data.get("bullets", []),
            },
            status=status.HTTP_200_OK,
        )


class GenerateQuizAPIView(APIView):
    """POST /api/documents/{id}/quiz/ — Generate AI quiz questions."""

    def post(self, request, pk, *args, **kwargs):
        document = get_object_or_404(Document, pk=pk)

        if not document.extracted_text:
            return Response(
                {"error": "No extracted text available. Please upload and process a PDF first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Delegate AI logic to services layer
        try:
            quiz_data = generate_quiz(document.extracted_text)
        except (ValueError, EnvironmentError) as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Persist each question to the Quiz model
        created_quizzes = []
        for item in quiz_data:
            quiz = Quiz.objects.create(
                document=document,
                question=item.get("question", ""),
                options=item.get("options", {}),
                correct_answer=item.get("correct_answer", ""),
            )
            created_quizzes.append(quiz)

        return Response(
            QuizSerializer(created_quizzes, many=True).data,
            status=status.HTTP_201_CREATED,
        )


class ChatDocumentAPIView(APIView):
    """POST /api/documents/{id}/chat/ — Chat with a document."""

    def post(self, request, pk, *args, **kwargs):
        document = get_object_or_404(Document, pk=pk)

        if not document.extracted_text:
            return Response(
                {"error": "No extracted text available. Please upload and process a PDF first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_question = request.data.get("question", "").strip()
        if not user_question:
            return Response(
                {"error": "A 'question' field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Delegate AI logic to services layer
        try:
            answer = chat_with_document(document.extracted_text, user_question)
        except (ValueError, EnvironmentError) as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Persist Q&A to the ChatSession model
        chat_session = ChatSession.objects.create(
            document=document,
            question=user_question,
            answer=answer,
        )

        return Response(
            ChatSessionSerializer(chat_session).data,
            status=status.HTTP_201_CREATED,
        )

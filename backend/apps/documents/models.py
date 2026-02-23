from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    extracted_text = models.TextField(blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Quiz(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='quizzes')
    question = models.TextField()
    options = models.JSONField() # Ex: {"A": "Opt 1", "B": "Opt 2", ...}
    correct_answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question

class ChatSession(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chats')
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat on {self.document.title}"

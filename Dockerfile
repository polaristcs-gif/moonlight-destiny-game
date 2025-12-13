FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir aiogram

# Copy bot script
COPY scripts/bot.py .

# Run bot
CMD ["python", "bot.py"]

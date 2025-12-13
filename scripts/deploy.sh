#!/bin/bash
# Простой скрипт деплоя на VPS

echo "Deploying Moonlight Destiny Bot..."

# Build and run
docker-compose up -d --build

echo "Bot is running!"
echo "Check logs: docker-compose logs -f"

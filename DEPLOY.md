# Деплой на твой VPS

## Быстрый старт (3 минуты):

1. **Залить файлы на VPS:**
   \`\`\`bash
   # На своем компе создай папку и положи туда:
   # - Dockerfile
   # - docker-compose.yml
   # - scripts/bot.py
   
   # Залей на VPS (замени user@your-vps-ip):
   scp -r * user@your-vps-ip:/home/user/moonlight-bot/
   \`\`\`

2. **Подключись к VPS:**
   \`\`\`bash
   ssh user@your-vps-ip
   cd moonlight-bot
   \`\`\`

3. **Запусти бота:**
   \`\`\`bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   \`\`\`

4. **Готово!** Бот работает 24/7.

## Команды:

- **Посмотреть логи:** `docker-compose logs -f`
- **Остановить:** `docker-compose down`
- **Перезапустить:** `docker-compose restart`

## Альтернатива без Docker (еще проще):

\`\`\`bash
# На VPS:
apt update && apt install python3 python3-pip
pip3 install aiogram
nohup python3 bot.py &
\`\`\`

---

## Для демо на 1-2 дня - самый быстрый способ:

Запусти на своем компе:
\`\`\`bash
python scripts/bot.py
\`\`\`

Пока показываешь демо - держи терминал открытым. Для тестового задания достаточно.

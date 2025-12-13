import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, CommandObject

# Your token from BotFather
TOKEN = "8352828151:AAF-LMBxlvy1N3sBcY_qhm-D386g5WuqYzQ"

dp = Dispatcher()

@dp.message(CommandStart())
async def command_start_handler(message: types.Message, command: CommandObject):
    """
    Handles /start command and deep links from the game
    When user clicks button on website, they arrive here with promo code
    Bot automatically gets their chat_id - no hardcoding needed
    """
    user_id = message.from_user.id
    username = message.from_user.full_name
    
    # Get promo code from deep link (what comes after ?start=)
    promo_code = command.args 
    
    if promo_code:
        # User came from game with winning code
        await message.answer(
            f"🌙 <b>Congratulations, {username}!</b>\n\n"
            f"✨ The stars have aligned in your favor.\n\n"
            f"Your winning code: <code>{promo_code}</code>\n\n"
            f"Show this code to claim your discount!", 
            parse_mode="HTML"
        )
        print(f"✅ Code {promo_code} issued to user {user_id} ({username})")
    else:
        # User found bot directly (not from game)
        await message.answer(
            "✨ <b>Welcome to Moonlight Destiny!</b>\n\n"
            "🌙 Play the game to receive your mystical promo code.\n\n"
            "The cosmos await your move...",
            parse_mode="HTML"
        )
        print(f"👋 New user {user_id} ({username}) started bot without code")

async def main():
    """Start the bot"""
    bot = Bot(token=TOKEN)
    print("🌙 Moonlight Destiny Bot is running...")
    print("📱 Waiting for users to claim their codes...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())

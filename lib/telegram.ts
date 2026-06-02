import TelegramBot from "node-telegram-bot-api";

let bot: TelegramBot | null = null;

function getBot(): TelegramBot | null {
  if (!process.env.TELEGRAM_BOT_TOKEN) return null;
  if (!bot) {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  }
  return bot;
}

export async function sendMessage(chatId: string, text: string): Promise<void> {
  const b = getBot();
  if (!b) return;
  await b.sendMessage(chatId, text, { parse_mode: "HTML" });
}

export async function sendToUser(text: string): Promise<void> {
  const { prisma } = await import("@/lib/prisma");
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!settings?.telegramChatId) return;
  await sendMessage(settings.telegramChatId, text);
}

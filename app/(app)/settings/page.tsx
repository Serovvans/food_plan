import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });

  return (
    <SettingsClient
      telegramChatId={settings?.telegramChatId ?? null}
      targets={{
        kcal: settings?.targetKcal ?? 2100,
        protein: settings?.targetProtein ?? 150,
        fat: settings?.targetFat ?? 67,
        carbs: settings?.targetCarbs ?? 210,
      }}
    />
  );
}

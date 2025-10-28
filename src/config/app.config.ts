import "dotenv/config";

export interface AppConfig {
  server: {
    port: number;
    basePath: string;
  };
  security: {
    apiKey: string;
  };
  whatsapp: {
    puppeteerOptions: {
      headless: boolean;
      args: string[];
    };
  };
  cron: {
    billingReminderSchedule: string;
    timezone: string;
  };
}

export const config: AppConfig = {
  server: {
    port: Number(process.env["PORT"]) || 5555,
    basePath: "/api",
  },
  security: {
    apiKey: process.env["X_API_KEY"] || "silvia-api-key-default",
  },
  whatsapp: {
    puppeteerOptions: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  },
  cron: {
    billingReminderSchedule: "0 52 18 * * *", // 18:52 WIB
    timezone: "Asia/Jakarta",
  },
};

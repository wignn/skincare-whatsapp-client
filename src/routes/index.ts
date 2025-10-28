import { Express } from "express";
import { config } from "../config";
import { messageRoutes } from "./message.routes";

export const setupRoutes = (app: Express): void => {
  // Health check
  app.get("/health", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });


  // API routes
  app.use(`${config.server.basePath}`, messageRoutes);
};

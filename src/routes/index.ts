import { Express } from "express";
import { config } from "../config";
import { messageRoutes } from "./message.routes";
import { metricsEndpoint } from "../metrics";

export const setupRoutes = (app: Express): void => {
  // Metrics and health endpoints
  app.use(metricsEndpoint());

  // API routes
  app.use(`${config.server.basePath}`, messageRoutes);
};

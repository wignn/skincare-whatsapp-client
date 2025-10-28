import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { ApiResponse } from "../types";
import { Logger } from "../utils";

/**
 * Middleware to validate x-api-key header
 */
export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    Logger.warn("API request without x-api-key header", {
      path: req.path,
      ip: req.ip,
    });

    const response: ApiResponse = {
      success: false,
      message: "x-api-key header is required",
    };
    res.status(401).json(response);
    return;
  }

  if (apiKey !== config.security.apiKey) {
    Logger.warn("API request with invalid x-api-key", {
      path: req.path,
      ip: req.ip,
      providedKey: apiKey.substring(0, 5) + "...", // Log only first 5 chars for security
    });

    const response: ApiResponse = {
      success: false,
      message: "Invalid x-api-key",
    };
    res.status(403).json(response);
    return;
  }

  next();
};

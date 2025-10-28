import { Router } from "express";
import { messageController } from "../controllers";
import { validateApiKey } from "../middlewares";

const router = Router();

router.post("/send-message", validateApiKey, (req, res) => messageController.sendMessage(req, res));

export const messageRoutes = router;

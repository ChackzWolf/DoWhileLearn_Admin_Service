import dotenv from "dotenv";
import { connectDB } from "./configs/DB.configs/MongoDB";
import express from "express";
import morgan from "morgan";
import { configs } from "./configs/ENV_configs/ENV.configs";
import { logger } from "./configs/logger.config";

dotenv.config();

export const createApp = () => {
  const app = express();

  connectDB();

  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

  return app;
};

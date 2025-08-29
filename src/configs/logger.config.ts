import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import morgan from "morgan";
import { configs } from "./ENV_configs/ENV.configs";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: configs.LOG_RETENTION_DAYS,
    }),
  ],
});

export const morganMiddleware = morgan("combined", {
  stream: { write: (message) => logger.info(message.trim()) },
});

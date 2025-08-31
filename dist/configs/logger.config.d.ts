import winston from "winston";
export declare const logger: winston.Logger;
export declare const morganMiddleware: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error) => void) => void;

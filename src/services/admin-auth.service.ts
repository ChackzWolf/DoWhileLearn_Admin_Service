import jwt from "jsonwebtoken";
import { IAdmin } from "../entities/admin.entity";
import { configs } from "../configs/ENV_configs/ENV.configs";
import { IAdminAuthService } from "./types/admin-auth.service.types";

const JWT_SECRET = configs.JWT_SECRET;
const REFRESH_TOKEN_SECRET = configs.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined");
}

export class AdminAuthService implements IAdminAuthService {
    
  createTokens(admin: IAdmin): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(
      {
        id: admin._id,
        role: "ADMIN",
        email: admin.email,
      },
      JWT_SECRET,
      { expiresIn: configs.JWT_EXPIRATION_TIME }
    );

    const refreshToken = jwt.sign(
      {
        id: admin._id,
        role: "ADMIN",
        email: admin.email,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: configs.REFRESH_TOKEN_EXPIRATION_TIME }
    );

    return { accessToken, refreshToken };
  }
}

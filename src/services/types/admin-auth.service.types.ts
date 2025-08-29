import { IAdmin } from "../../entities/admin.entity";

export interface IAdminAuthService {
  createTokens(admin: IAdmin): {
    accessToken: string;
    refreshToken: string;
  };
}
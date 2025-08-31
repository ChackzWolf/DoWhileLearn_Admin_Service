import { IAdmin } from "../entities/admin.entity";
import { IAdminAuthService } from "./types/admin-auth.service.types";
export declare class AdminAuthService implements IAdminAuthService {
    createTokens(admin: IAdmin): {
        accessToken: string;
        refreshToken: string;
    };
}

import { AdminLoginDTO,AdminLoginResponseService } from "../DTOs/Admin.dtos";
export interface IAdminService {

    adminLogin(loginData: AdminLoginDTO): Promise<AdminLoginResponseService>;

}

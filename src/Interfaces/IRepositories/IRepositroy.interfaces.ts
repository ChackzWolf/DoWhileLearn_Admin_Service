// IAdminRepository.ts
import { IAdmin } from "../Models/IAdmin";


export interface IAdminRepository {
    findByEmail(email: string): Promise<IAdmin | null>;
}
// IAdminRepository.ts
import { IAdmin, ITempAdmin } from "../models/AdminModel";

export interface IAdminRepository {
    findByEmail(email: string): Promise<IAdmin | null>;
}
import { IAdmin } from "../interfaces/Models/IAdmin";
declare const createToken: (admin: IAdmin) => {
    accessToken: string;
    refreshToken: string;
};
export default createToken;

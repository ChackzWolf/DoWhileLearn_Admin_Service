import { IAdmin } from "../Interfaces/Models/IAdmin";
declare const createToken: (admin: IAdmin) => {
    accessToken: string;
    refreshToken: string;
};
export default createToken;

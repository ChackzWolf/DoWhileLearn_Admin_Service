import dotenv from "dotenv";
import jwt ,{ Secret }from "jsonwebtoken";
import { IAdmin } from "../Interfaces/Models/IAdmin";
import { configs } from "../Configs/ENV_configs/ENV.configs";

dotenv.config()

const JWT_SECRET = configs.JWT_SECRET;
const REFRESH_TOKEN_SECRET = configs.REFRESH_TOKEN_SECRET;

if(!JWT_SECRET || !REFRESH_TOKEN_SECRET){
    throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. ")
}

const createToken = (admin:IAdmin) : {accessToken:string,refreshToken:string} =>{

    const accessToken = jwt.sign(
        {
            id : admin._id,
            role:'ADMIN',
            email: admin.email,  
        },JWT_SECRET as Secret,
        { expiresIn: configs.JWT_EXPIRATION_TIME }
    )
    
    const refreshToken = jwt.sign(
        {
            id: admin._id,
            role:'ADMIN',
            email: admin.email,
        },
        REFRESH_TOKEN_SECRET as Secret,
        {expiresIn: configs.REFRESH_TOKEN_EXPIRATION_TIME}
    )

    return {accessToken, refreshToken}
}

export default createToken
 
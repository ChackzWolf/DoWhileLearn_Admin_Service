import { configs } from 'Configs/ENV_configs/ENV.configs'
import {grpcServer} from './app'

grpcServer()  
console.log(configs.JWT_SECRET, 'jwt secret');
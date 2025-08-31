import { KafkaMessage } from 'kafkajs';
import { IAdminService } from '../../services/Interfaces/IService.interfaces';
import { IAdminKafkaController } from './interfaces/IAdmin-kafka.controller';
export declare class AdminKafkaController implements IAdminKafkaController {
    private adminService;
    constructor(adminService: IAdminService);
    start(): Promise<void>;
    routeMessage(_topics: string[], message: KafkaMessage, topic: string): Promise<void>;
    handleMessage(message: KafkaMessage): Promise<void>;
    handleRollback(message: KafkaMessage): Promise<void>;
}

import { IAdminService } from '../../services/Interfaces/IService.interfaces';
export declare class AdminKafkaController {
    private adminService;
    constructor(adminService: IAdminService);
    start(): Promise<void>;
    private routeMessage;
    private handleMessage;
    private handleRollback;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminKafkaController = void 0;
const Kafka_config_1 = require("../../configs/Kafka.configs/Kafka.config");
class AdminKafkaController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async start() {
        const topics = ['admin.update', 'admin-service.rollback'];
        await Kafka_config_1.kafkaConfig.consumeMessages('admin-service-group', topics, this.routeMessage.bind(this));
    }
    async routeMessage(_topics, message, topic) {
        try {
            switch (topic) {
                case 'admin.update':
                    await this.handleMessage(message);
                    break;
                case 'admin-service.rollback':
                    await this.handleRollback(message);
                    break;
                default:
                    console.warn(`Unhandled topic: ${topic}`);
            }
        }
        catch (error) {
            console.error('Error processing message:', error);
        }
    }
    async handleMessage(message) {
        try {
            const paymentEvent = JSON.parse(message.value?.toString() || '{}');
            await this.adminService.handleOrderSuccess(paymentEvent);
        }
        catch (error) {
            console.error('Error in handleMessage:', error);
        }
    }
    async handleRollback(message) {
        try {
            const eventData = JSON.parse(message.value?.toString() || '{}');
            await this.adminService.handleOrderTransactionFail(eventData.data);
        }
        catch (error) {
            console.error('Error in handleRollback:', error);
        }
    }
}
exports.AdminKafkaController = AdminKafkaController;

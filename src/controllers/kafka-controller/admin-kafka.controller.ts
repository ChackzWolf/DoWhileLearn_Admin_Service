import { KafkaMessage } from 'kafkajs';
import { kafkaConfig } from "../../configs/Kafka.configs/Kafka.config";
import { OrderEventData } from "../../contracts/events";
import { IAdminService } from '../../services/Interfaces/IService.interfaces';

export class AdminKafkaController {
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  async start(): Promise<void> {
    const topics = ['admin.update', 'admin-service.rollback'];
    await kafkaConfig.consumeMessages(
      'admin-service-group',
      topics,
      this.routeMessage.bind(this)
    );
  }

  private async routeMessage(_topics: string[], message: KafkaMessage, topic: string): Promise<void> {
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
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  private async handleMessage(message: KafkaMessage): Promise<void> {
    try {
      const paymentEvent: OrderEventData = JSON.parse(message.value?.toString() || '{}');
      await this.adminService.handleOrderSuccess(paymentEvent);
    } catch (error) {
      console.error('Error in handleMessage:', error);
    }
  }

  private async handleRollback(message: KafkaMessage): Promise<void> {
    try {
      const eventData = JSON.parse(message.value?.toString() || '{}');
      await this.adminService.handleOrderTransactionFail(eventData.data);
    } catch (error) {
      console.error('Error in handleRollback:', error);
    }
  }
}

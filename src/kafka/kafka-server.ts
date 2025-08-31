import { AdminKafkaController } from "../controllers/kafka-controller/admin-kafka.controller";
import { IAdminService } from "../services/Interfaces/IService.interfaces";

export const startKafkaServer = async (adminService: IAdminService) => {
  const kafkaController = new AdminKafkaController(adminService);

  try {
    await kafkaController.start();
    console.log("✅ Kafka consumer started");
  } catch (error) {
    console.error("❌ Failed to start Kafka consumer:", error);
  }
};

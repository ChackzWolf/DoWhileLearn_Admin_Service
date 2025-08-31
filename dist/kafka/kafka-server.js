"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKafkaServer = void 0;
const admin_kafka_controller_1 = require("../controllers/kafka-controller/admin-kafka.controller");
const startKafkaServer = async (adminService) => {
    const kafkaController = new admin_kafka_controller_1.AdminKafkaController(adminService);
    try {
        await kafkaController.start();
        console.log("✅ Kafka consumer started");
    }
    catch (error) {
        console.error("❌ Failed to start Kafka consumer:", error);
    }
};
exports.startKafkaServer = startKafkaServer;

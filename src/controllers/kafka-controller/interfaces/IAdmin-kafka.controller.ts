import { KafkaMessage } from "kafkajs"

export interface IAdminKafkaController {
    start(): Promise<void>
    routeMessage(topics: string[], message: KafkaMessage, topic: string): Promise<void>
    handleMessage(message: KafkaMessage): Promise<void>
    handleRollback(message: KafkaMessage): Promise<void>
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaConfig = exports.KafkaConfig = void 0;
// utils/kafka.ts
const kafkajs_1 = require("kafkajs");
class KafkaConfig {
    constructor() {
        this.producer = null;
        this.consumer = null;
        this.kafka = new kafkajs_1.Kafka({
            clientId: 'nodejs-kafka',
            brokers: ['education-kafka.dowhilelearn.svc.cluster.local:29092'],
            retry: {
                maxRetryTime: 60000, // 60 seconds
            },
            connectionTimeout: 10000, // 10 seconds
            requestTimeout: 25000, // 25 seconds
        });
    }
    static getInstance() {
        if (!KafkaConfig.instance) {
            KafkaConfig.instance = new KafkaConfig();
        }
        return KafkaConfig.instance;
    }
    async getProducer() {
        if (!this.producer) {
            this.producer = this.kafka.producer();
            await this.producer.connect();
        }
        return this.producer;
    }
    async getConsumer(groupId) {
        if (!this.consumer) {
            this.consumer = this.kafka.consumer({ groupId });
            await this.consumer.connect();
        }
        return this.consumer;
    }
    async sendMessage(topic, message) {
        try {
            const producer = await this.getProducer();
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }]
            });
            console.log(`Message sent to topic ${topic}:`, message);
        }
        catch (error) {
            console.error(`Error sending message to ${topic}:`, error);
            throw error;
        }
    }
    async consumeMessages(groupId, topics, messageHandler) {
        try {
            const consumer = await this.getConsumer(groupId);
            await Promise.all(topics.map(topic => consumer.subscribe({ topic })));
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log(`Received message from topic ${topic}:`, message.value?.toString());
                    await messageHandler(topics, message, topic);
                }
            });
        }
        catch (error) {
            console.error('Error consuming messages:', error);
            throw error;
        }
    }
}
exports.KafkaConfig = KafkaConfig;
exports.kafkaConfig = KafkaConfig.getInstance();

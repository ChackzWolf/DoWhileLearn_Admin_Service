// utils/kafka.ts
import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';

export class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private static instance: KafkaConfig;

  private constructor() { 
    this.kafka = new Kafka({
      clientId: 'nodejs-kafka',
      brokers: ['localhost:9092'],
      retry: {
        maxRetryTime: 60000, // 60 seconds

      },
      connectionTimeout: 10000, // 10 seconds
      requestTimeout: 25000, // 25 seconds
    });
  }

  public static getInstance(): KafkaConfig {
    if (!KafkaConfig.instance) {
      KafkaConfig.instance = new KafkaConfig();
    }
    return KafkaConfig.instance;
  }

  async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer();
      await this.producer.connect();
    }
    return this.producer;
  }

  async getConsumer(groupId: string): Promise<Consumer> {
    if (!this.consumer) {
      this.consumer = this.kafka.consumer({ groupId });
      await this.consumer.connect();
    } 
    return this.consumer;
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    try {
      const producer = await this.getProducer();
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      });
      console.log(`Message sent to topic ${topic}:`, message);
    } catch (error) {
      console.error(`Error sending message to ${topic}:`, error);
      throw error;
    }
  }

  async consumeMessages(
    groupId: string,
    topics: string[],
    messageHandler: (topics: string[], message: KafkaMessage, topic: string) => Promise<void>
  ): Promise<void> {
    try {
      const consumer = await this.getConsumer(groupId);
      await Promise.all(topics.map(topic => consumer.subscribe({ topic })));

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log(`Received message from topic ${topic}:`, message.value?.toString());
          await messageHandler(topics, message, topic);
        }
      });
    } catch (error) {
      console.error('Error consuming messages:', error);
      throw error;
    }
  }
}

export const kafkaConfig = KafkaConfig.getInstance();
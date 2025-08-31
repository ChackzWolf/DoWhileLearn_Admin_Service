import { Producer, Consumer, KafkaMessage } from 'kafkajs';
export declare class KafkaConfig {
    private kafka;
    private producer;
    private consumer;
    private static instance;
    private constructor();
    static getInstance(): KafkaConfig;
    getProducer(): Promise<Producer>;
    getConsumer(groupId: string): Promise<Consumer>;
    sendMessage(topic: string, message: any): Promise<void>;
    consumeMessages(groupId: string, topics: string[], messageHandler: (topics: string[], message: KafkaMessage, topic: string) => Promise<void>): Promise<void>;
}
export declare const kafkaConfig: KafkaConfig;

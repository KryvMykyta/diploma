import { Consumer, Kafka, Message, Producer } from 'kafkajs'
import kafkaInstance from '@config/kafka'

class KafkaConfig {
    kafka: Kafka
    producer: Producer
    consumer: Consumer
    constructor() {
        this.kafka = kafkaInstance
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({groupId: 'test-group'});
    }

    async produce(topic: string, messages: Message[]) {
        try {
          await this.producer.connect();
          await this.producer.send({
            topic: topic,
            messages: messages,
          });
        } catch (error) {
          console.error(error);
        } finally {
          await this.producer.disconnect();
        }
    }

    async produceNewRatingMessage() {
        await this.produce('newRating', [{value: 'New rating message'}])
    }
}

const kafka = new KafkaConfig()

export default kafka
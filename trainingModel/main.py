from confluent_kafka import Consumer, KafkaException, KafkaError
import sys
import logging
from training_handler import kafka_treshold_handler
def main():
    kafka_config = {
        'bootstrap.servers': 'localhost:29092',
        'group.id': 'test_group',
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(kafka_config)
    training_data = [0, 0]
    try:
        consumer.subscribe(['newRating'])
        while True:
            msg = consumer.poll(timeout=1.0)

            if msg is None: continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    sys.stderr.write('%% %s [%d] reached end at offset %d\n' %
                                     (msg.topic(), msg.partition(), msg.offset()))
                # elif msg.error():
                    # raise KafkaException(msg.error())
            else:
                kafka_treshold_handler(training_data)

    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()
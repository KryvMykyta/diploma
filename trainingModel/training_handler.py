from confluent_kafka import Consumer, KafkaException, KafkaError
import sys
import logging
from EASE import EASE
from generate_fit_data import generate_fit_data
import threading


def training_thread_func(data):
    data_to_fit = generate_fit_data()
    recommender = EASE()
    recommender.fit(data_to_fit)
    recommender.save()
    data[1] *= 0
    return

def kafka_treshold_handler(data):
    data[0] += 1
    print('new rating counter: %d' % data[0])
    if (data[0] > 5):

        print("need to be trained")

        if (data[1] == 0):
            print("not training rn")
            data[1] += 1
            data[0] *= 0
            training_thread_func(data)
        else:
            print('Already training')
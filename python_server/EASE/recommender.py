import datetime
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix, identity, csc_matrix, diags
from scipy.sparse.linalg import spsolve
from sklearn.metrics import ndcg_score
from sklearn.preprocessing import LabelEncoder
from aws.s3 import bucket
import os
import threading

from logger import logging

class EASE():
    def __init__(self):
        self.enc = LabelEncoder()
        self.is_worker_running = False
        self.is_initializing = True

    def predict(self, interactions, k=10, item='movieId', value='rating'):
        self.load()

        interactions = pd.DataFrame(interactions)

        interactions = interactions[interactions[item].isin(self.enc.classes_)]
        if interactions.empty:
            return list()

        items = self.enc.transform(interactions[item])
        X = np.zeros(len(self.enc.classes_))
        X[items] = interactions[value].values

        pred = X[None] @ self.w
        pred = pred[0]
        pred[items] = -1000000000

        top_ids = np.argpartition(pred, -k)[-k:]

        top_items = self.enc.inverse_transform(top_ids)
        top_scores = pred[top_ids]
        sorted_top = top_items[np.argsort(-top_scores)]

        return list(sorted_top), X[items], pred[items]

    def upload_file_from_bucket(self):
        bucket.download_file('w.npy', 'w.npy')
        t = np.load('w.npy')
        self.enc.classes_ = t[0].astype(int)
        self.w = t[1:]
        self.is_worker_running = False
        logging.info('finished uploading')

    def load(self):
        if self.is_initializing:
            logging.info('initializing')
            if (not os.path.exists('w.npy')):
                logging.info('no file - downloading and initializing')
                bucket.download_file('w.npy', 'w.npy')
                t = np.load('w.npy')
                self.enc.classes_ = t[0].astype(int)
                self.w = t[1:]
                self.is_initializing = False
                return
            elif (int(datetime.datetime.now().timestamp()) - os.path.getmtime('w.npy') > 12 * 60 * 60):
                logging.info('old file - downloading and initializing')
                bucket.download_file('w.npy', 'w.npy')
                t = np.load('w.npy')
                self.enc.classes_ = t[0].astype(int)
                self.w = t[1:]
                self.is_initializing = False
                return
            else:
                logging.info('norm file - initializing')
                t = np.load('w.npy')
                self.is_initializing = False
                self.enc.classes_ = t[0].astype(int)
                self.w = t[1:]
                return

        logging.info('initialized, loading')
        if not self.is_worker_running:
            logging.info('is_worker_running false')
            if (not os.path.exists('w.npy')):
                logging.info('started thread')
                self.is_worker_running = True
                worker = threading.Thread(target=self.upload_file_from_bucket, daemon=True)
                worker.start()
                return
            elif (int(datetime.datetime.now().timestamp()) - os.path.getmtime('w.npy') > 12 * 60 * 60):
                logging.info('started thread')
                self.is_worker_running = True
                worker = threading.Thread(target=self.upload_file_from_bucket, daemon=True)
                worker.start()
                return

recommender = EASE()
recommender.load()
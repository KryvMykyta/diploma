import numpy as np
from scipy.sparse import csr_matrix, identity
from sklearn.preprocessing import LabelEncoder
from aws import bucket

from logger import logging


class EASE():
    def __init__(self):
        self.enc = LabelEncoder()

    def fit(self, data, user='userId', item='movieId', value='rating'):
        logging.info('Training model')

        items = self.enc.fit_transform(data[item])
        users = data[user].rank(method='dense').values.astype(int)
        values = data[value].values

        X = csr_matrix((values, (users, items))).astype(np.float32)

        G = X.T @ X
        G += 500 * identity(G.shape[0])
        G = G.todense()

        P = np.linalg.inv(G)
        B = -P / np.diag(P)
        np.fill_diagonal(B, 0.)

        self.w = B
        self.w = np.array(self.w)

        logging.info('Trained')

    def save(self):
        cat = np.concatenate([self.enc.classes_[None], self.w])
        np.save('w.npy', cat)
        logging.info('Start uploading')

        bucket.upload_file('w.npy', 'w.npy')
        logging.info('Uploaded')

from pydantic import BaseModel
from fastapi import FastAPI, Body
from fastapi.encoders import jsonable_encoder
from database.models import Rating
from database import Session
from fastapi.middleware.cors import CORSMiddleware
from EASE.recommender import recommender
from sqlalchemy import func
from logger import logging
from sklearn.metrics import ndcg_score
import numpy as np
import os
from database import session
from dotenv import load_dotenv

load_dotenv()

class DataItem(BaseModel):
    user_id: int

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"result": "test"}

@app.post("/")
async def root(data: DataItem = Body()):
    data = jsonable_encoder(data)
    user_id = data['user_id']

    ratings = session.query(Rating).filter(Rating.userId == user_id).all()
    data_to_predict = {
        'movieId': [],
        'rating': []
    }
    for rating in ratings:
        data_to_predict['movieId'].append(rating.movieId)
        data_to_predict['rating'].append(rating.rating)
    result = recommender.predict(data_to_predict, k=30)
    if (len(result) == 0):
        return {"result": result}
    prediction_result = result[0]
    prediction = []
    for r in prediction_result:
        prediction.append(r.item())
    return {"result": prediction}


@app.post("/check")
async def root():
    logging.info('start')

    user_ids_with_high_ratings = (
        session.query(Rating.userId)
        .filter(Rating.rating > 3)
        .group_by(Rating.userId)
        .having(func.count(Rating.id) >= 15)
        .limit(50)
        .all()
    )
    user_ids = [user_id for (user_id,) in user_ids_with_high_ratings]
    logging.info('users')

    metric_results = []
    for user_id in user_ids:
        user_ratings = session.query(Rating).filter(Rating.userId == user_id).all()
        data_to_predict = {
            'movieId': [],
            'rating': []
        }
        for rating in user_ratings:
            data_to_predict['movieId'].append(rating.movieId)
            data_to_predict['rating'].append(rating.rating)
        prediction = recommender.predict(data_to_predict, k=30)

        metric = ndcg_score([prediction[1]], [prediction[2]])
        metric_results.append(metric)
        print('metric result for user_Id = ' + str(user_id) + ' :' + str(metric))

    print('Average metric result: ' + str(np.average(metric_results)))

    return {"result": str(np.average(metric_results))}
from database import session
from database.models import Rating
from sqlalchemy import func
import pandas as pd
import logging


def generate_fit_data():

    logging.info('Gathering user_ids')
    user_ids_with_high_ratings = (
        session.query(Rating.userId)
        .filter(Rating.rating > 3)
        .group_by(Rating.userId)
        .having(func.count(Rating.id) >= 30)
        .all()
    )

    user_ids = [user_id for (user_id,) in user_ids_with_high_ratings]
    logging.info('Gathered user_ids, gathering ratings')
    ratings = session.query(Rating).filter(Rating.rating > 3).filter(Rating.userId.in_(user_ids)).all()
    logging.info('Gathered ratings, formatting data')
    data_to_predict = {
        'userId': [],
        'movieId': [],
        'rating': []
    }
    for rating in ratings:
        data_to_predict['userId'].append(rating.userId)
        data_to_predict['movieId'].append(rating.movieId)
        data_to_predict['rating'].append(rating.rating)
    logging.info('Formatted, returning')

    return pd.DataFrame(data_to_predict)
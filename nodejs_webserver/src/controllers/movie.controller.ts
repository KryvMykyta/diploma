import kafka from "@utils/kafka";
import { RatingDAO } from "@dao/rating.dao";
import { forbidden, unauthorized } from "@hapi/boom";
import { NextFunction, Request, Response } from "express";
import { MovieDAO } from "@/dao/movie.dao";
import axios from 'axios'
import Joi from "joi";

export class MovieController {
  constructor() {}

  public getMovies = async (
    req: Request<{},{},{},{
      page: string,
      limit: string,
      search: string
    }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit, search } = req.query
      const pageNumber = page ? +page : 1
      const limitValue = limit ? +limit : 10
      const user = req.user || null
      const movies = await MovieDAO.getMovies(pageNumber, limitValue, search, user)
      const totalCount = await MovieDAO.getTotalMovies(search)
      return res.status(200).send({
        movies,
        page,
        totalPages: Math.ceil(totalCount/(+limit))
      });
    } catch (err) {
      next(err)
    }
  };

  public setRating = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) throw unauthorized('Unauthorized')
        
      const { movieId, rating } = req.body;
      const { id: userId } = req.user;

      const schema = Joi.object({
        movieId: Joi.number().required(),
        rating: Joi.number().min(0).max(5).required(),
      });
      await schema.validateAsync(req.body);
  
      const addRatingData = {
        movieId,
        rating,
        userId,
      };

      const existingRating = await RatingDAO.getUserMovieRating(userId, movieId)

      if (existingRating) throw forbidden('This movie already have rating from you')
  
      const createdRating = await RatingDAO.createRating(addRatingData);

      await kafka.produceNewRatingMessage()
  
      return res.status(200).send({ rating: createdRating });
    } catch(err) {
      next(err)
    }
  };

  public getRecommendedMovies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) throw unauthorized('Unauthorized')

      const { id: userId } = req.user;
      
      const { data: recommendedResponse } = await axios.post('http://127.0.0.1:8000', {
        user_id: userId
      })

      const movieIds = recommendedResponse.result

      const moviesData = await MovieDAO.getMoviesFromIdList(movieIds)
  
      return res.status(200).send(moviesData);
    } catch(err) {
      next(err)
    }
  };
}

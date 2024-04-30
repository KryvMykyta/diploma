import { RatingDAO } from "@/dao/rating.dao";
import { UserDAO } from "@/dao/user.dao";
import { unauthorized } from "@hapi/boom";
import { NextFunction, Request, Response } from "express";

export class UserController {
  constructor() {}

  public getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw unauthorized('Unauthorized')
      return res.status(200).send(req.user);
    } catch (err) {
      next(err)
    }
  };

  public getRatings = async (req: Request<{},{},{},{
      page: string,
      limit: string,
    }>, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw unauthorized('Unauthorized')
      const { page, limit } = req.query
      const pageNumber = page ? +page : 1
      const limitValue = limit ? +limit : 10
      const userRatings = await RatingDAO.getUserRatings(req.user.id, pageNumber, limitValue)
      return res.status(200).send({
        userRatings: userRatings.rows,
        page: pageNumber,
        totalPages: Math.ceil(userRatings.count/limitValue)
      });
    } catch (err) {
      next(err)
    }
  };
}

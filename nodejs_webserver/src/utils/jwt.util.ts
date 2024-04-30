import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { notFound, unauthorized } from "@hapi/boom";
import config from "@/config/variables";
import { UserDAO } from "@/dao/user.dao";

export class JWTUtils {
  constructor() {}

  public static authVerify = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        headers: { authorization: bearer_token },
      } = req;
      if (!bearer_token) {
        req.user = null
        next()
        return;
      }
      const token = bearer_token.split(" ")[1];
      let user = null
      try {
        user = jwt.verify(token, config.SECRET_AUTH_KEY) as {
          username: string
          id: string
        }
      } catch(e) {
        user = null
      }
      if (!user) {
        req.user = null
        next()
        return;
      }
      req.user = user
      next();
    } catch (err) {
      next(err);
    }
  };
}

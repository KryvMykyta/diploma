import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { conflict, notFound, unauthorized } from "@hapi/boom";
import config from "@config/variables";
import { UserDAO } from "@dao/user.dao";
import Joi from 'joi'

export class AuthController {
  constructor() {}

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      });
      await schema.validateAsync(req.body);

      const user = await UserDAO.getUserByUsername(username);
      if (!user) {
        throw notFound('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw unauthorized('Invalid password');
      }
      const token = jwt.sign({ id: user.id, username: user.username }, config.SECRET_AUTH_KEY, { expiresIn: '30d' });
      return res.status(200).send({ user, token });
    } catch (err) {
      next(err)
    }
  };

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body
      const schema = Joi.object({
        username: Joi.string().min(4).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(20).required(),
      });
      await schema.validateAsync(req.body);

      const existingUser = await UserDAO.getUserByUsername(username)

      if (existingUser) throw conflict('User is already existing')
  
      const hashedPassword = await bcrypt.hash(password, 10);

      const userCreateData = {
        username,
        email,
        password: hashedPassword
      }
      const user = await UserDAO.createUser(userCreateData);
      return res.status(200).send({user});
    } catch (err) {
      next(err)
    }
  };

}

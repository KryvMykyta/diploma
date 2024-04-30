import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import sequelize from "@config/sequelize";
import { Boom, isBoom } from "@hapi/boom";
import { AuthRouter } from "@routers/auth.router";
import { UserRouter } from "@routers/user.router";
import Joi from 'joi'
import kafka from "./utils/kafka";
import { MovieRouter } from "./routers/movie.router";

(async () => {
  const app = express();
  const PORT = 3000;
  
  await sequelize.sync()
  // await sequelize.sync({alter: true})
  
  app.use(express.json());
  app.use(cors());

  const authRouter = new AuthRouter('/auth')
  const userRouter = new UserRouter('/user')
  const movieRouter = new MovieRouter('/movie')
  
  const routes = [authRouter, userRouter, movieRouter];
  routes.forEach((route) => {
    app.use(route.path, route.router);
  });

  app.get('/sendMessage', async (req, res) => {
    await kafka.produceNewRatingMessage()
    return res.status(200).send("111")
  })

  app.use((req,res) => {
    return res.status(404).send("Endpoint not found")
  })

  app.use(function(err: Error | Boom, req: Request, res: Response, next: NextFunction) {
    if (isBoom(err)) {
      const errorPayload = err.output.payload
      return res.status(errorPayload.statusCode).send({
        status: errorPayload.statusCode,
        message: errorPayload.message,
        body: errorPayload
      })
    }

    if (Joi.isError(err)) {
      return res.status(400).send({
        status: 400,
        message: 'Validation error',
        body: err.details
      })
    }

    console.log(err)
    return res.status(500).send({
      status: 500,
      message: 'Internal server error.',
      body: err
    });
  });

  app.listen(PORT, () => {
    console.log("started");
  });
})();
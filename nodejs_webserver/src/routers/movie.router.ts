import { MovieController } from "@controllers/movie.controller";
import { JWTUtils } from "@utils/jwt.util";
import { Router } from "express";

export class MovieRouter {
  router: Router;
  path: string;
  controller: MovieController;

  constructor(path: string) {
    (this.router = Router()), (this.path = path);
    this.controller = new MovieController();
    this.router.get('/',JWTUtils.authVerify,this.controller.getMovies)
    this.router.post('/rating', JWTUtils.authVerify, this.controller.setRating)
    this.router.get('/recommendations', JWTUtils.authVerify, this.controller.getRecommendedMovies)
  }
}
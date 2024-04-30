import { UserController } from "@/controllers/user.controller";
import { JWTUtils } from "@/utils/jwt.util";
import { Router } from "express";

export class UserRouter {
  router: Router;
  path: string;
  controller: UserController;

  constructor(path: string) {
    (this.router = Router()), (this.path = path);
    this.controller = new UserController();
    this.router.get('/', JWTUtils.authVerify, this.controller.getMe)
    this.router.get('/ratings', JWTUtils.authVerify, this.controller.getRatings)
  }
}
import like from "../controllers/like";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";

function likeRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/likes")
    .get(permission.role([ROLE.USER, ROLE.ADMIN]), like.getLikes)
    .post(permission.role([ROLE.USER, ROLE.ADMIN]), like.handleLike);
  // app
  //   .route("/api/likes/:id")
  //   .get(like.getLike)
}

export default likeRouter;

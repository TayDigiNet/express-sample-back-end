import comment from "../controllers/comment";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";

function commentRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/comments")
    .get(comment.getComments)
    .post(permission.role([ROLE.USER, ROLE.ADMIN]), comment.createComment);
  app
    .route("/api/comments/:id")
    .get(comment.getComment)
    .put(permission.role([ROLE.USER, ROLE.ADMIN]), comment.updateComment)
    .delete(permission.role([ROLE.USER, ROLE.ADMIN]), comment.deteleComment);
}

export default commentRouter;

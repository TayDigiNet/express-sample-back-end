import users from "../controllers/users";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";
import upload from "../middlewares/upload.middleware";

function usersRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/users")
    .get(permission.role([ROLE.ADMIN]), users.getUsers)
    .post(permission.role([ROLE.ADMIN]), users.createUser);
  app
    .route("/api/users/:id")
    .get(permission.role([ROLE.ADMIN]), users.getUser)
    .put(permission.role([ROLE.ADMIN]), users.updateUser)
    .patch(permission.role([ROLE.ADMIN]), users.updateUserFields)
    .delete(permission.role([ROLE.ADMIN]), users.deteleUser);
  app
    .route("/api/users/:id/block-user")
    .post(permission.role([ROLE.ADMIN]), users.blockUser)
  app
    .route("/api/users/:id/avatar")
    .post(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'avatar', 
        maxCount: 1
      }
    ]),users.updateImages, users.uploadAvatar);
}

export default usersRouter;

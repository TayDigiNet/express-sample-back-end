import project from "../controllers/project";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import cache from "../middlewares/cache.middleware";
import upload from "../middlewares/upload.middleware";
import { ROLE } from "../configs/constants";

function projectRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/projects")
    .get(permission.role(), project.getProjects)
    .post(
      permission.role([ROLE.ADMIN, ROLE.USER]),
      upload.uploadImage.fields([
        {
          name: "images",
          maxCount: 10,
        },
        {
          name: "avatar",
          maxCount: 1,
        },
      ]),
      project.updateImages,
      project.createProject
    );
  app
    .route("/api/projects/:id")
    .get(permission.role(), project.getProject)
    .put(
      permission.role([ROLE.ADMIN, ROLE.USER]),
      upload.uploadImage.fields([
        {
          name: "images",
          maxCount: 10,
        },
        {
          name: "avatar",
          maxCount: 1,
        },
      ]),
      project.updateImages,
      project.updateProject
    )
    .patch(
      permission.role([ROLE.ADMIN, ROLE.USER]),
      upload.uploadImage.fields([
        {
          name: "images",
          maxCount: 10,
        },
        {
          name: "avatar",
          maxCount: 1,
        },
      ]),
      project.updateImages,
      project.updateProjectFields
    )
    .delete(permission.role([ROLE.ADMIN, ROLE.USER]), project.deteleProject);
  app
    .route("/api/projects/:id/approve")
    .post(permission.role([ROLE.ADMIN]), project.approveProject);
  app
    .route("/api/projects/:id/request-approve")
    .post(permission.role([ROLE.ADMIN]), project.requestApproveProject);
  app.route("/api/projects/:id/shared-count").post(project.sharedCount);
}

export default projectRouter;

import projectCategory from "../controllers/project_category";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";

function projectCategoryRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/projectCategories")
    .get(projectCategory.getProjectCategories)
    .post(permission.role([ROLE.ADMIN]), projectCategory.createProjectCategory);

    app
    .route("/api/projectCategories/:id")
    .get(projectCategory.getProjectCategory)
    .put(permission.role([ROLE.ADMIN]), projectCategory.updateProjectCategory)
    .delete(permission.role([ROLE.ADMIN]), projectCategory.deteleProjectCategory);
}

export default projectCategoryRouter;

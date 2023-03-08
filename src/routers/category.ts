import category from "../controllers/category";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";

function categoryRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/categories")
    .get(category.getCategories)
    .post(permission.role([ROLE.ADMIN]), category.createCategory);

    app
    .route("/api/categories/:id")
    .get(category.getCategory)
    .put(permission.role([ROLE.ADMIN]), category.updateCategory)
    .delete(permission.role([ROLE.ADMIN]), category.deteleCategory);
}

export default categoryRouter;

import eventCategory from "../controllers/event_category";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";

function eventCategoryRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/eventCategories")
    .get(eventCategory.getEventCategories)
    .post(permission.role([ROLE.ADMIN]), eventCategory.createEventCategory);

    app
    .route("/api/eventCategories/:id")
    .get(eventCategory.getEventCategory)
    .put(permission.role([ROLE.ADMIN]), eventCategory.updateEventCategory)
    .delete(permission.role([ROLE.ADMIN]), eventCategory.deteleEventCategory);
}

export default eventCategoryRouter;

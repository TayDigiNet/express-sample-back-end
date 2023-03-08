import event from "../controllers/event";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import cache from "../middlewares/cache.middleware";
import upload from "../middlewares/upload.middleware";
import { ROLE } from "../configs/constants";

function eventRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/events")
    .get(permission.role(), event.getEvents)
    .post(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'images', 
        maxCount: 10
      }
    ]),event.updateImages, event.createEvent);
  app
    .route("/api/events/:id")
    .get(permission.role(), event.getEvent)
    .put(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'images', 
        maxCount: 10
      }
    ]),event.updateImages, event.updateEvent)
    .patch(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'images', 
        maxCount: 10
      }
    ]),event.updateImages, event.updateEventFields)
    .delete(permission.role([ROLE.ADMIN]), event.deteleEvent);
    app
    .route("/api/events/:id/published")
    .post(permission.role([ROLE.ADMIN]), event.publishedEvent);
}

export default eventRouter;

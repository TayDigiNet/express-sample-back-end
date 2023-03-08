import person from "../controllers/person";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import cache from "../middlewares/cache.middleware";
import upload from "../middlewares/upload.middleware";
import { ROLE } from "../configs/constants";

function personRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/people")
    .get(person.getPeople)
    .post(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'avatar', 
        maxCount: 1
      }
    ]),person.updateImages, person.createPerson);
  app
    .route("/api/people/:id")
    .get(person.getPerson)
    .put(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'avatar', 
        maxCount: 1
      }
    ]),person.updateImages, person.updatePerson)
    .patch(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'avatar', 
        maxCount: 1
      }
    ]),person.updateImages, person.updatePersonFields)
    .delete(permission.role([ROLE.ADMIN]), person.detelePerson);
}

export default personRouter;

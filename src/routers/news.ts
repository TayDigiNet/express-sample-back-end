import news from "../controllers/news";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import cache from "../middlewares/cache.middleware";
import upload from "../middlewares/upload.middleware";
import { ROLE } from "../configs/constants";

function newsRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/newses")
    .get(permission.role(), news.getNewses)
    .post(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'banner', 
        maxCount: 1 
      }
    ]), news.updateImages, news.createNews);
  app
    .route("/api/newses/:id")
    .get(permission.role(), news.getNews)
    .put(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'banner', 
        maxCount: 1 
      }
    ]), news.updateImages, news.updateNews)
    .patch(permission.role([ROLE.ADMIN]), upload.uploadImage.fields([
      { 
        name: 'banner', 
        maxCount: 1 
      }
    ]), news.updateImages, news.updateNewsFields)
    .delete(permission.role([ROLE.ADMIN]), news.deteleNews);
  app
    .route("/api/newses/:id/published")
    .post(permission.role([ROLE.ADMIN]), news.publishedNews);
}

export default newsRouter;

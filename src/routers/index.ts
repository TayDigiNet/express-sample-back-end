import authRouter from "./auth";
import categoryRouter from "./category";
import eventRouter from "./event";
import newsRouter from "./news";
import personRouter from "./person";
import projectRouter from "./project";
import usersRouter from "./users";
import projectCategoryRouter from "./project_category";
import wishlistRouter from "./wishlist";
import likeRouter from "./like";
import commentRouter from "./comment";
import eventCategoryRouter from "./event_category";

function router(app: any) {
  usersRouter(app);
  authRouter(app);
  categoryRouter(app);
  newsRouter(app);
  eventRouter(app);
  personRouter(app);
  projectRouter(app);
  projectCategoryRouter(app);
  wishlistRouter(app);
  likeRouter(app);
  commentRouter(app);
  eventCategoryRouter(app);
}

export default router;

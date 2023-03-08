import wishlist from "../controllers/wishlist";
import PermissionMiddleware from "../middlewares/permissions.middleware";
import { ROLE } from "../configs/constants";

function wishlistRouter(app: any) {
  const permission = new PermissionMiddleware();
  app
    .route("/api/wishlists")
    .get(permission.role([ROLE.USER, ROLE.ADMIN]), wishlist.getWishlists)
    .post(permission.role([ROLE.USER, ROLE.ADMIN]), wishlist.handleWishlist);
  // app
  //   .route("/api/wishlists/:id")
  //   .get(wishlist.getWishlist)
}

export default wishlistRouter;

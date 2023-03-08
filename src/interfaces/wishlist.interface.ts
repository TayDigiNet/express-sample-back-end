import WishlistDTO, { WishlistInput } from "../dto/wishlist.dto";
import { QueryOptions, QueryResponse } from "../dto/typings.dto";

export default interface WishlistInterface {
  getWishlists(
    data?: Partial<QueryOptions & { CreaterId: number }>
  ): Promise<QueryResponse<WishlistDTO>>;
  getWishlistById(data?: Partial<QueryOptions & { id: number }>): Promise<WishlistDTO | undefined>;
  createWishlist(
    data: WishlistInput & { slug: string; CreaterId: number }
  ): Promise<WishlistDTO | undefined>;
  updateWishlist(
    id: number,
    data: Partial<WishlistInput>
  ): Promise<WishlistDTO | undefined>;
  deleteWishlist(id: number, userId: number): Promise<boolean>;
}

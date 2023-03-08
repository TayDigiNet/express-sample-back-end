import { QueryOptions } from "../dto/typings.dto";
import UserDTO from "../dto/user.dto";
import { toSlug } from "../helpers/utils";
import { Pagination, ResponseEntry } from "../typings";
import RedisContext from "../cache/redis";
import WishlistDTO, { WishlistInput } from "../dto/wishlist.dto";
import WishlistRepository from "../repository/wishlist.repository";
const fs = require('fs');
const path = require('path');

export async function getWishlists(
  query: any,
  queryOptions: Partial<QueryOptions>,
  user: UserDTO
): Promise<ResponseEntry<WishlistDTO[]>> {
  const Wishlist = new WishlistRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<QueryOptions & {id?: number, UserId: number, isEvent?: number, isProject?: number, isNews?: number }> = queryOptions;
    options.UserId = user.id;
    /** Query data */
    const records = await Wishlist.getWishlists(options);
    if(queryOptions.limit != null && queryOptions.offset != null){
      /** Get pagination */
      const pageSize = records.rows.length;
      const pageCount = Math.ceil(records.count / queryOptions.limit);
      const pagination: Pagination = {
        count: records.count,
        page: parseInt(query.pagination.page, 10),
        pageCount,
        pageSize,
      };
      meta = {
        pagination,
      };
    } 
    return {
      data: records.rows as WishlistDTO[],
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
      meta: meta
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function getWishlistById(
  id: number,
  queryOptions: Partial<QueryOptions>,
  user: UserDTO
): Promise<ResponseEntry<WishlistDTO | null>> {
  const Wishlist = new WishlistRepository();
  const redis = RedisContext.getConnect();
  try {
    /** Build query options */
    let options: Partial<QueryOptions & {id: number, UserId: number }> = queryOptions;
    options.id = id;
    options.UserId = user.id;
    const record: any = await Wishlist.getWishlistById(options);
    return {
      data: record as WishlistDTO,
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function createWishlist(
  data: WishlistInput,
  user: UserDTO
): Promise<ResponseEntry<WishlistDTO | null>> {
  const Wishlist = new WishlistRepository();  
  try {
    const record = await Wishlist.createWishlist({
      ...data,
      UserId: user.id
    });
    return {
      data: record as WishlistDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function handleWishlist(
  data: WishlistInput,
  user: UserDTO
): Promise<ResponseEntry<WishlistDTO | null>> {
  const Wishlist = new WishlistRepository();  
  try {
    let options: {id?: number, UserId: number, EventId?: number, ProjectId?: number, NewsId?: number } = data;
    if(data?.EventId !== undefined){
      options.EventId = data.EventId;
    }
    else if(data?.ProjectId !== undefined){
      options.ProjectId = data.ProjectId;
    }
    else if(data?.NewsId !== undefined){
      options.NewsId = data.NewsId;
    }
    options.UserId = user.id;
    const wishlist: any = await Wishlist.getWishlistById(options);
    if(wishlist){
      await Wishlist.deleteWishlist(wishlist.id, user.id);
      return {
        data: null,
        status: {
          code: 201,
          message: "Removed from the wishlist!",
          success: true,
        },
      };
    }
    const record = await Wishlist.createWishlist({
      ...options,
      UserId: user.id
    });
    return {
      data: record as WishlistDTO,
      status: {
        code: 201,
        message: "Added to the wishlist!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateWishlist(
  id: number,
  data: WishlistInput
): Promise<ResponseEntry<WishlistDTO | null>> {
  const Wishlist = new WishlistRepository();
  try {
    const record = await Wishlist.updateWishlist(id, data);
    // remove images
    return {
      data: record as WishlistDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateWishlistFields(
  id: number,
  data: Partial<WishlistInput>
): Promise<ResponseEntry<WishlistDTO | null>> {
  const Wishlist = new WishlistRepository();
  try {
    const record = await Wishlist.updateWishlist(id, data);
    return {
      data: record as WishlistDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function deleteWishlist(id: number, user: UserDTO): Promise<ResponseEntry<boolean>> {
  const Wishlist = new WishlistRepository();
  try {
    const result = await Wishlist.deleteWishlist(id, user.id);
    if (!result)
      return {
        data: false,
        status: {
          code: 406,
          message: "Not Acceptable or Record do not exist",
          success: false,
        },
      };
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: false,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}
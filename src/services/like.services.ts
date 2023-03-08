import { QueryOptions } from "../dto/typings.dto";
import UserDTO from "../dto/user.dto";
import { toSlug } from "../helpers/utils";
import { Pagination, ResponseEntry } from "../typings";
import RedisContext from "../cache/redis";
import LikeDTO, { LikeInput } from "../dto/like.dto";
import LikeRepository from "../repository/like.repository";
const fs = require('fs');
const path = require('path');

export async function getLikes(
  query: any,
  queryOptions: Partial<QueryOptions>,
  user: UserDTO
): Promise<ResponseEntry<LikeDTO[]>> {
  const Like = new LikeRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<QueryOptions & {id?: number, UserId: number, isEvent?: number, isProject?: number, isNews?: number }> = queryOptions;
    options.UserId = user.id;
    /** Query data */
    const records = await Like.getLikes(options);
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
      data: records.rows as LikeDTO[],
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

export async function getLikeById(
  id: number,
  queryOptions: Partial<QueryOptions>,
  user: UserDTO
): Promise<ResponseEntry<LikeDTO | null>> {
  const Like = new LikeRepository();
  const redis = RedisContext.getConnect();
  try {
    /** Build query options */
    let options: Partial<QueryOptions & {id: number, UserId: number }> = queryOptions;
    options.id = id;
    options.UserId = user.id;
    const record: any = await Like.getLikeById(options);
    return {
      data: record as LikeDTO,
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

export async function createLike(
  data: LikeInput,
  user: UserDTO
): Promise<ResponseEntry<LikeDTO | null>> {
  const Like = new LikeRepository();  
  try {
    const record = await Like.createLike({
      ...data,
      UserId: user.id
    });
    return {
      data: record as LikeDTO,
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

export async function handleLike(
  data: LikeInput,
  user: UserDTO
): Promise<ResponseEntry<LikeDTO | null>> {
  const Like = new LikeRepository();  
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
    const like: any = await Like.getLikeById(options);
    if(like){
      await Like.deleteLike(like.id, user.id);
      return {
        data: null,
        status: {
          code: 201,
          message: "Removed from the like!",
          success: true,
        },
      };
    }
    const record = await Like.createLike({
      ...options,
      UserId: user.id
    });
    return {
      data: record as LikeDTO,
      status: {
        code: 201,
        message: "Added to the like!",
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

export async function updateLike(
  id: number,
  data: LikeInput
): Promise<ResponseEntry<LikeDTO | null>> {
  const Like = new LikeRepository();
  try {
    const record = await Like.updateLike(id, data);
    // remove images
    return {
      data: record as LikeDTO,
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

export async function updateLikeFields(
  id: number,
  data: Partial<LikeInput>
): Promise<ResponseEntry<LikeDTO | null>> {
  const Like = new LikeRepository();
  try {
    const record = await Like.updateLike(id, data);
    return {
      data: record as LikeDTO,
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

export async function deleteLike(id: number, user: UserDTO): Promise<ResponseEntry<boolean>> {
  const Like = new LikeRepository();
  try {
    const result = await Like.deleteLike(id, user.id);
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
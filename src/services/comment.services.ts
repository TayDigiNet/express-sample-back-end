import { QueryOptions } from "../dto/typings.dto";
import UserDTO from "../dto/user.dto";
import { toSlug } from "../helpers/utils";
import { Pagination, ResponseEntry } from "../typings";
import RedisContext from "../cache/redis";
import CommentDTO, { CommentInput } from "../dto/comment.dto";
import CommentRepository from "../repository/comment.repository";
const fs = require('fs');
const path = require('path');

export async function getComments(
  query: any,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<CommentDTO[]>> {
  const Comment = new CommentRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<QueryOptions & {eventId?: number, projectId?: number, newsId?: number }> = queryOptions;
    /** Query data */
    const records = await Comment.getComments(options);
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
      data: records.rows as CommentDTO[],
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

export async function getCommentById(
  id: number,
  queryOptions: Partial<QueryOptions>,
  user: UserDTO
): Promise<ResponseEntry<CommentDTO | null>> {
  const Comment = new CommentRepository();
  const redis = RedisContext.getConnect();
  try {
    /** Build query options */
    let options: Partial<QueryOptions & {id: number, UserId: number }> = queryOptions;
    options.id = id;
    options.UserId = user.id;
    const record: any = await Comment.getCommentById(options);
    return {
      data: record as CommentDTO,
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

export async function createComment(
  data: CommentInput,
  user: UserDTO
): Promise<ResponseEntry<CommentDTO | null>> {
  const Comment = new CommentRepository();  
  try {
    if(!data.content){
      return {
        data: null,
        status: {
          code: 406,
          message: "Missing 'comment' field.",
          success: false,
        },
      };
    }
    const record = await Comment.createComment({
      ...data,
      UserId: user.id
    });
    return {
      data: record as CommentDTO,
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

export async function updateComment(
  id: number,
  data: CommentInput
): Promise<ResponseEntry<CommentDTO | null>> {
  const Comment = new CommentRepository();
  try {
    if(!data.content){
      throw "Missing 'content' field";
    }
    
    const record = await Comment.updateComment(id, { content: data.content, UserId: data.UserId});
    // remove images
    return {
      data: record as CommentDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error: any) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: error.toString(),
        success: false,
      },
    };
  }
}

export async function updateCommentFields(
  id: number,
  data: Partial<CommentInput>
): Promise<ResponseEntry<CommentDTO | null>> {
  const Comment = new CommentRepository();
  try {
    if(!data.content){
      return {
        data: null,
        status: {
          code: 406,
          message: "Missing 'comment' field.",
          success: false,
        },
      };
    }
    const record = await Comment.updateComment(id, data);
    return {
      data: record as CommentDTO,
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

export async function deleteComment(id: number, user: UserDTO): Promise<ResponseEntry<boolean>> {
  const Comment = new CommentRepository();
  try {
    const result = await Comment.deleteComment(id, user.id);
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
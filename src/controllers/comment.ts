import { NextFunction, Request, Response } from "express";
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  updateComment,
  updateCommentFields
} from "../services/comment.services";

export default {
  getComments: async function (req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const queryOptions = res.locals.queryOptions;
    if(query.eventId !== undefined){
      queryOptions.eventId = query.eventId;
    }
    else if(query.projectId !== undefined){
      queryOptions.projectId = query.projectId;
    }
    else if(query.newsId !== undefined){
      queryOptions.newsId = query.newsId;
    }
    else{
      return res.status(406).json({
        data: null,
        status: {
          code: 406,
          message: "Missing parameter eventId/projectId/newsId",
          success: true,
        }
      });
    }
    const records = await getComments(query, queryOptions);
    res.status(records.status.code).json(records);
  },
  getComment: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const queryOptions = res.locals.queryOptions;
    const user = res.locals.user;
    const record = await getCommentById(parseInt(id, 0), queryOptions, user);
    res.status(record.status.code).json(record);
  },
  createComment: async function (
    req: Partial<Request & { files: any }>,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    let data: any = {};
    const user = res.locals.user;
    if(body.EventId !== undefined){
      data.EventId = body.EventId;
    }
    else if(body.ProjectId !== undefined){
      data.ProjectId = body.ProjectId;
    }
    else if(body.NewsId !== undefined){
      data.NewsId = body.NewsId;
    }
    data.content = body.content;
    const newRecord = await createComment({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  updateComment: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    body.UserId = user.id;
    const record = await updateComment(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  updateCommentFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    body.UserId = user.id;
    const record = await updateCommentFields(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  deteleComment: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    const data = await deleteComment(parseInt(id, 0), user);
    res.status(data.status.code).json(data);
  }
};

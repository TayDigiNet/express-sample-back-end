import { NextFunction, Request, Response } from "express";
import {
  createLike,
  deleteLike,
  getLikeById,
  getLikes,
  updateLike,
  updateLikeFields,
  handleLike
} from "../services/like.services";

export default {
  getLikes: async function (req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const queryOptions = res.locals.queryOptions;
    const user = res.locals.user;
    if(query.isEvent !== undefined){
      queryOptions.isEvent = true;
    }
    if(query.isProject !== undefined){
      queryOptions.isProject = true;
    }
    if(query.isNews !== undefined){
      queryOptions.isNews = true;
    }
    const records = await getLikes(query, queryOptions, user);
    res.status(records.status.code).json(records);
  },
  getLike: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const queryOptions = res.locals.queryOptions;
    const user = res.locals.user;
    const record = await getLikeById(parseInt(id, 0), queryOptions, user);
    res.status(record.status.code).json(record);
  },
  createLike: async function (
    req: Partial<Request & { files: any }>,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const user = res.locals.user;
    const newRecord = await createLike({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  handleLike: async function (
    req: Partial<Request & { files: any }>,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const user = res.locals.user;
    const newRecord = await handleLike({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  updateLike: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    body.UserId = user.id;
    const record = await updateLike(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  updateLikeFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    body.UserId = user.id;
    const record = await updateLikeFields(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  deteleLike: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    const data = await deleteLike(parseInt(id, 0), user);
    res.status(data.status.code).json(data);
  }
};

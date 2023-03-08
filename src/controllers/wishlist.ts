import { NextFunction, Request, Response } from "express";
import {
  createWishlist,
  deleteWishlist,
  getWishlistById,
  getWishlists,
  updateWishlist,
  updateWishlistFields,
  handleWishlist
} from "../services/wishlist.services";
const path = require('path');

export default {
  getWishlists: async function (req: Request, res: Response, next: NextFunction) {
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
    const records = await getWishlists(query, queryOptions, user);
    res.status(records.status.code).json(records);
  },
  getWishlist: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const queryOptions = res.locals.queryOptions;
    const user = res.locals.user;
    const record = await getWishlistById(parseInt(id, 0), queryOptions, user);
    res.status(record.status.code).json(record);
  },
  createWishlist: async function (
    req: Partial<Request & { files: any }>,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const user = res.locals.user;
    const newRecord = await createWishlist({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  handleWishlist: async function (
    req: Partial<Request & { files: any }>,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const user = res.locals.user;
    const newRecord = await handleWishlist({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  updateWishlist: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    body.UserId = user.id;
    const record = await updateWishlist(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  updateWishlistFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    body.UserId = user.id;
    const record = await updateWishlistFields(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  deteleWishlist: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const user = res.locals.user;
    const data = await deleteWishlist(parseInt(id, 0), user);
    res.status(data.status.code).json(data);
  }
};

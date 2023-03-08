import { NextFunction, Request, Response } from "express";
import { createEventCategory, getEventCategories, updateEventCategory, deleteEventCategory, getEventCategoryById } from "../services/event_category.sevices";

export default {
  getEventCategories: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const categories = await getEventCategories();
    res.status(categories.status.code).json(categories);
  },
  getEventCategory: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const record = await getEventCategoryById(parseInt(id, 10));
    res.status(record.status.code).json(record);
  },
  createEventCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const { name, sort } = body;
    const eventCategory = await createEventCategory({ name, sort });
    res.status(eventCategory.status.code).json(eventCategory);
  },
  updateEventCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    const record = await updateEventCategory(parseInt(id, 10), { ...body });
    res.status(record.status.code).json(record);
  },
  deteleEventCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const data = await deleteEventCategory(parseInt(id, 10));
    res.status(data.status.code).json(data);
  },
};

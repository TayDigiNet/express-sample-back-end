import { NextFunction, Request, Response } from "express";
import { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById } from "../services/category.sevices";

export default {
  getCategories: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const categories = await getCategories();
    res.status(categories.status.code).json(categories);
  },
  getCategory: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const record = await getCategoryById(parseInt(id, 10));
    res.status(record.status.code).json(record);
  },
  createCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const { name, sort } = body;
    const category = await createCategory({ name, sort });
    res.status(category.status.code).json(category);
  },
  updateCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    const record = await updateCategory(parseInt(id, 10), { ...body });
    res.status(record.status.code).json(record);
  },
  deteleCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const data = await deleteCategory(parseInt(id, 10));
    res.status(data.status.code).json(data);
  },
};

import { NextFunction, Request, Response } from "express";
import { createProjectCategory, getProjectCategories, updateProjectCategory, deleteProjectCategory, getProjectCategoryById } from "../services/project_category.sevices";

export default {
  getProjectCategories: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const categories = await getProjectCategories();
    res.status(categories.status.code).json(categories);
  },
  getProjectCategory: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const record = await getProjectCategoryById(parseInt(id, 10));
    res.status(record.status.code).json(record);
  },
  createProjectCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const { name, sort } = body;
    const projectCategory = await createProjectCategory({ name, sort });
    res.status(projectCategory.status.code).json(projectCategory);
  },
  updateProjectCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    const record = await updateProjectCategory(parseInt(id, 10), { ...body });
    res.status(record.status.code).json(record);
  },
  deteleProjectCategory: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const data = await deleteProjectCategory(parseInt(id, 10));
    res.status(data.status.code).json(data);
  },
};

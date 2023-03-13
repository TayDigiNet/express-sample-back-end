import { NextFunction, Request, Response } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
  updateProjectFields,
  validateImage,
  approveProject,
  requestApproveProject,
  sharedCount,
} from "../services/project.services";
import { resizeImage } from "../helpers/utils";
import { ProjectImageInput } from "../dto/project_image.dto";
import { v4 as uuidv4 } from "uuid";
const path = require("path");
import { ROLE } from "../configs/constants";

export default {
  getProjects: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const query = req.query;
    const queryOptions = res.locals.queryOptions;
    if (res.locals.user === undefined) {
      queryOptions.published = true;
    }
    if (req.query.published !== undefined) {
      queryOptions.published = true;
    }
    // get projects by user
    if (req.query.user !== undefined) {
      if (res.locals.user != undefined) {
        queryOptions.user = res.locals.user;
      } else {
        queryOptions.user = { id: 0 };
      }
    }
    // get projects isn't expired
    if (req.query.unexpired !== undefined) {
      queryOptions.unexpired = req.query.unexpired;
    }
    // get projects need approved
    if (
      res.locals.user != undefined &&
      res.locals.user.role.name === ROLE.ADMIN
    ) {
      if (req.query.unapproved !== undefined) {
        queryOptions.userRole = true;
        queryOptions.requestApproved = true;
      } else if (req.query.approved !== undefined) {
        queryOptions.allExcludeRequestApproved = true;
      }
    }
    if (res.locals.user != undefined) {
      queryOptions.UserId = res.locals.user.id;
    }
    if (req.query.draft !== undefined) {
      queryOptions.draft = req.query.draft;
    }
    const records = await getProjects(query, queryOptions);
    res.status(records.status.code).json(records);
  },
  getProject: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const queryOptions = res.locals.queryOptions;
    if (res.locals.user != undefined) {
      queryOptions.UserId = res.locals.user.id;
    }
    const record = await getProjectById(parseInt(id, 10), queryOptions);
    res.status(record.status.code).json(record);
  },
  createProject: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const user = res.locals.user;
    body.draft = body.draft ? JSON.parse(body.draft) : false;
    const newRecord = await createProject({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  updateProject: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft ? JSON.parse(body.draft) : false;
    const record = await updateProject(
      parseInt(id, 0),
      { ...body },
      res.locals.user
    );
    res.status(record.status.code).json(record);
  },
  updateProjectFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft ? JSON.parse(body.draft) : false;
    const record = await updateProjectFields(
      parseInt(id, 0),
      { ...body },
      res.locals.user
    );
    res.status(record.status.code).json(record);
  },
  deteleProject: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const data = await deleteProject(parseInt(id, 10));
    res.status(data.status.code).json(data);
  },
  updateImages: async function (
    req: Partial<Request & { files: any; file: any }>,
    res: Response,
    next: NextFunction
  ) {
    let images: ProjectImageInput[] = [];
    if (req.files) {
      if (req.files.images) {
        for (let i = 0; i < req.files.images.length; i++) {
          // validate image
          let validateImg = validateImage(req.files.images[i]);
          if (!validateImg.data) {
            return res.status(validateImg.status.code).json(validateImg);
          }

          let filename =
            uuidv4() + path.extname(req.files.images[i].originalname);
          const imagePath = path.join(
            process.env.ROOT_FOLDER,
            process.env.UPLOAD_PATH,
            process.env.FOLDER_PROJECT,
            filename
          );
          const result = await resizeImage(
            req.files.images[i].buffer,
            imagePath
          );
          images.push({
            imageOriginalName: req.files.images[i].originalname,
            imageMineType: req.files.images[i].mimetype,
            imageSize: result.size,
            imageDimensions: result.width + "x" + result.height,
            imageName: filename,
            imagePath: "upload/" + process.env.FOLDER_PROJECT + "/" + filename,
          });
        }
      }
      if (req.files.avatar && req.files.avatar.length > 0) {
        // validate image
        let validateImg = validateImage(req.files.avatar[0]);
        if (!validateImg.data) {
          return res.status(validateImg.status.code).json(validateImg);
        }

        let filename =
          uuidv4() + path.extname(req.files.avatar[0].originalname);
        const imagePath = path.join(
          process.env.ROOT_FOLDER,
          process.env.UPLOAD_PATH,
          process.env.FOLDER_PROJECT,
          filename
        );
        const result = await resizeImage(req.files.avatar[0].buffer, imagePath);
        req.body.imageAvatarOriginalName = req.files.avatar[0].originalname;
        req.body.imageAvatarMineType = req.files.avatar[0].mimetype;
        req.body.imageAvatarSize = result.size;
        req.body.imageAvatarDimensions = result.width + "x" + result.height;
        req.body.imageAvatarName = filename;
        req.body.imageAvatarPath =
          "upload/" + process.env.FOLDER_PROJECT + "/" + filename;
      }
    }
    if (req.body) {
      req.body.projectImages = images;
    }

    next();
  },

  approveProject: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    const record = await approveProject(
      parseInt(id, 0),
      { published: body.published },
      res.locals.user
    );
    res.status(record.status.code).json(record);
  },

  requestApproveProject: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    const record = await requestApproveProject(
      parseInt(id, 0),
      { requestApproved: body.requestApproved },
      res.locals.user
    );
    res.status(record.status.code).json(record);
  },

  sharedCount: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const record = await sharedCount(parseInt(id, 10));
    res.status(record.status.code).json(record);
  },
};

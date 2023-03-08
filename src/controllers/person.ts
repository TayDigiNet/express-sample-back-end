import { NextFunction, Request, Response } from "express";
import {
  createPerson,
  deletePerson,
  getPersonById,
  getPeople,
  updatePerson,
  updatePersonFields
} from "../services/person.services";
import {resizeImage, validateImage} from "../helpers/utils";
import { v4 as uuidv4 } from "uuid";
const path = require('path');

export default {
  getPeople: async function (req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const queryOptions = res.locals.queryOptions;
    const records = await getPeople(query, queryOptions);
    res.status(records.status.code).json(records);
  },
  getPerson: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const record = await getPersonById(parseInt(id, 10));
    res.status(record.status.code).json(record);
  },
  createPerson: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const user = res.locals.user;
    const newRecord = await createPerson({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  updatePerson: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    const record = await updatePerson(parseInt(id, 10), { ...body });
    res.status(record.status.code).json(record);
  },
  updatePersonFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const id = params.id;
    const record = await updatePersonFields(parseInt(id, 10), { ...body });
    res.status(record.status.code).json(record);
  },
  detelePerson: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const data = await deletePerson(parseInt(id, 10));
    res.status(data.status.code).json(data);
  },
  updateImages: async function (
    req: Partial<Request & { files: any, file: any }>,
    res: Response,
    next: NextFunction
  ) {
    if(req.files){
      if(req.files.avatar && req.files.avatar.length > 0){
        // validate image
        let validateImg = validateImage(req.files.avatar[0]);
        if(!validateImg.data){
          return res.status(validateImg.status.code).json(validateImg);
        }

        let filename = uuidv4() + path.extname(req.files.avatar[0].originalname);
        const imagePath = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_PROJECT, filename);
        const result = await resizeImage(req.files.avatar[0].buffer, imagePath);
        req.body.imageAvatarOriginalName = req.files.avatar[0].originalname;
        req.body.imageAvatarMineType = req.files.avatar[0].mimetype;
        req.body.imageAvatarSize = result.size;
        req.body.imageAvatarDimensions = result.width + "x" + result.height;
        req.body.imageAvatarName = filename;
        req.body.imageAvatarPath = "upload/" + process.env.FOLDER_PROJECT + "/" + filename;
      }
    }
    
    next();
  },
};

import { NextFunction, Request, Response } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  updateEvent,
  updateEventFields,
  publishedEvent,
  validateImage
} from "../services/event.services";
import {resizeImage} from "../helpers/utils";
import {EventImageInput} from "../dto/event_image.dto";
import { v4 as uuidv4 } from "uuid";
const path = require('path');
import { ROLE } from "../configs/constants";

export default {
  getEvents: async function (req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const queryOptions = res.locals.queryOptions;
    if(req.query.all !== undefined && res.locals.user != undefined && res.locals.user.role.name === ROLE.ADMIN){
      queryOptions.all = req.query.all;
    }
    if(req.query.EventCategoryId !== undefined){
      queryOptions.EventCategoryId = req.query.EventCategoryId;
    }
    const records = await getEvents(query, queryOptions);
    res.status(records.status.code).json(records);
  },
  getEvent: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const queryOptions = res.locals.queryOptions;
    if(res.locals.user != undefined){
      queryOptions.UserId = res.locals.user.id;
    }
    const record = await getEventById(parseInt(id, 0), queryOptions);
    res.status(record.status.code).json(record);
  },
  createEvent: async function (
    req: Partial<Request & { files: any }>,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const user = res.locals.user;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    const newRecord = await createEvent({ ...body }, user);
    res.status(newRecord.status.code).json(newRecord);
  },
  updateEvent: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    const record = await updateEvent(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  updateEventFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    const record = await updateEventFields(parseInt(id, 0), { ...body });
    res.status(record.status.code).json(record);
  },
  deteleEvent: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const data = await deleteEvent(parseInt(id, 0));
    res.status(data.status.code).json(data);
  },
  publishedEvent: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const { published } = body;
    const user = res.locals.user;
    const id = params.id;
    const newRecord = await publishedEvent(parseInt(id, 0), published);
    res.status(newRecord.status.code).json(newRecord);
  },

  updateImages: async function (
    req: Partial<Request & { files: any, file: any }>,
    res: Response,
    next: NextFunction
  ) {
    let images: EventImageInput[] = [];
    if(req.files){
      if(req.files.images){
        for(let i = 0; i<req.files.images.length; i++){
          // validate image
          let validateImg = validateImage(req.files.images[i]);
          if(!validateImg.data){
            return res.status(validateImg.status.code).json(validateImg);
          }

          let filename = uuidv4() + path.extname(req.files.images[i].originalname);
          const imagePath = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_EVENT, filename);
          const result = await resizeImage(req.files.images[i].buffer, imagePath);
          images.push({
            imageOriginalName: req.files.images[i].originalname,
            imageMineType: req.files.images[i].mimetype,
            imageSize: result.size,
            imageDimensions: result.width + "x" + result.height,
            imageName: filename,
            imagePath: "upload/" + process.env.FOLDER_EVENT + "/" + filename,
          });
        }
      }
    }
    if(req.body){
      req.body.eventImages = images;
    }
    
    next();
  },
};

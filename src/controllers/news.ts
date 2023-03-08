import { NextFunction, Request, Response } from "express";
import {
  createNews,
  deleteNews,
  getNewsById,
  getNewses,
  updateNews,
  updateNewsFields,
  publishedNews,
  validateImage
} from "../services/news.services";
import {resizeImage} from "../helpers/utils";
import { v4 as uuidv4 } from "uuid";
const path = require('path');
import { ROLE } from "../configs/constants";

export default {
  getNewses: async function (req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const queryOptions = res.locals.queryOptions;
    if(req.query.all !== undefined && res.locals.user != undefined && res.locals.user.role.name === ROLE.ADMIN){
      queryOptions.all = req.query.all;
    }
    const newses = await getNewses(query, queryOptions);
    res.status(newses.status.code).json(newses);
  },
  getNews: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const queryOptions = res.locals.queryOptions;
    if(res.locals.user != undefined){
      queryOptions.UserId = res.locals.user.id;
    }
    const news = await getNewsById(parseInt(id, 10), queryOptions);
    res.status(news.status.code).json(news);
  },
  createNews: async function (req: Request, res: Response, next: NextFunction) {
    let body = req.body;
    const user = res.locals.user;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    const newNews = await createNews(
      { ...body },
      user
    );
    res.status(newNews.status.code).json(newNews);
  },
  updateNews: async function (req: Request, res: Response, next: NextFunction) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    const news = await updateNews(parseInt(id, 10), { ...body });
    res.status(news.status.code).json(news);
  },
  updateNewsFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    const news = await updateNewsFields(parseInt(id, 10), { ...body });
    res.status(news.status.code).json(news);
  },
  deteleNews: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const data = await deleteNews(parseInt(id, 10));
    res.status(data.status.code).json(data);
  },
  publishedNews: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const params = req.params;
    const { published } = body;
    const user = res.locals.user;
    const id = params.id;
    const newRecord = await publishedNews(parseInt(id, 0), published);
    res.status(newRecord.status.code).json(newRecord);
  },
  updateImages: async function (
    req: Partial<Request & { files: any, file: any }>,
    res: Response,
    next: NextFunction
  ) {
    if(req.files){
      if(req.files.banner && req.files.banner.length > 0){
        // validate image
        let validateImg = validateImage(req.files.banner[0]);
        if(!validateImg.data){
          return res.status(validateImg.status.code).json(validateImg);
        }

        let filename = uuidv4() + path.extname(req.files.banner[0].originalname);
        const imagePath = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_NEWS, filename);
        const result = await resizeImage(req.files.banner[0].buffer, imagePath);
        req.body.imageBannerOriginalName = req.files.banner[0].originalname;
        req.body.imageBannerMineType = req.files.banner[0].mimetype;
        req.body.imageBannerSize = result.size;
        req.body.imageBannerDimensions = result.width + "x" + result.height;
        req.body.imageBannerName = filename;
        req.body.imageBannerPath = "upload/" + process.env.FOLDER_NEWS + "/" + filename;
      }
    }
    
    next();
  },
};

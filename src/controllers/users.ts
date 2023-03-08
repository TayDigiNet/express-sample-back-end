import { NextFunction, Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserFields,
  updateUserInfor,
  blockUser,
  excludeFields,
  uploadAvatar
} from "../services/user.services";
import {resizeImage, validateImage} from "../helpers/utils";
import { v4 as uuidv4 } from "uuid";
const path = require('path');


export default {
  updateProject: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const body = req.body;
    const user = res.locals.user;
    const record = await updateUserInfor(user.id, { ...body });
    res.status(record.status.code).json(record);
  },
  getUsers: async function (req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const queryOptions = res.locals.queryOptions;
    const users = await getUsers(query, queryOptions);
    res.status(users.status.code).json(users);
  },
  getUser: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const queryOptions = res.locals.queryOptions;
    const user = await getUserById(parseInt(id, 10), queryOptions);
    res.status(user.status.code).json(user);
  },
  createUser: async function (req: Request, res: Response, next: NextFunction) {
    let body = req.body;
    const user = res.locals.user;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    const newUser = await createUser(
      { ...body },
      user
    );
    res.status(newUser.status.code).json(newUser);
  },
  updateUser: async function (req: Request, res: Response, next: NextFunction) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    // excluse some fields
    body = await excludeFields(body);
    const user = await updateUser(parseInt(id, 10), { ...body });
    res.status(user.status.code).json(user);
  },
  updateUserFields: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    body.draft = body.draft? JSON.parse( body.draft ): false;
    // excluse some fields
    body = await excludeFields(body);
    const user = await updateUserFields(parseInt(id, 10), { ...body });
    res.status(user.status.code).json(user);
  },
  deteleUser: async function (req: Request, res: Response, next: NextFunction) {
    const params = req.params;
    const id = params.id;
    const data = await deleteUser(parseInt(id, 10));
    res.status(data.status.code).json(data);
  },
  blockUser: async function (req: Request, res: Response, next: NextFunction) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const data = await blockUser(parseInt(id, 10), {...body});
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
        const imagePath = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_USERS, filename);
        const result = await resizeImage(req.files.avatar[0].buffer, imagePath);
        req.body.imageAvatarOriginalName = req.files.avatar[0].originalname;
        req.body.imageAvatarMineType = req.files.avatar[0].mimetype;
        req.body.imageAvatarSize = result.size;
        req.body.imageAvatarDimensions = result.width + "x" + result.height;
        req.body.imageAvatarName = filename;
        req.body.imageAvatarPath = "upload/" + process.env.FOLDER_USERS + "/" + filename;
      }
    }
    
    next();
  },
  uploadAvatar: async function (req: Request, res: Response) {
    let body = req.body;
    const params = req.params;
    const id = params.id;
    const data = await uploadAvatar(parseInt(id, 0), {...body});
    res.status(data.status.code).json(data);
  },
  
};

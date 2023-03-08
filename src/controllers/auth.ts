import { Request, Response, Errback, NextFunction } from "express";
import { register, login, refetchToken, confirmation, forgotPassword, loginFacebook, loginGoogle, loginPocket, sendMailContact } from "../services/auth.services";
import { updateUser, excludeFields, uploadAvatar } from "../services/user.services";

export default {
  register: async function (req: Request, res: Response) {
    const body = req.body;
    const { email, password } = body;
    const data = await register(email, password);
    res.status(data.status.code).json(data);
  },
  login: async function (req: Request, res: Response) {
    const body = req.body;
    const { email, password } = body;
    const data = await login(email, password);
    res.status(data.status.code).json(data);
  },
  refetch: async function (req: Request, res: Response) {
    const body = req.body;
    const { refetchJwt } = body;
    const data = await refetchToken(refetchJwt);
    res.status(data.status.code).json(data);
  },
  me: async function (req: Request, res: Response) {
    const user = res.locals.user;
    res.status(200).json({
      data: user,
      status: {
        code: 200,
        message: "Successful!",
        success: true,
      },
    });
  },
  confirmation: async function (req: Request, res: Response) {
    const body = req.body;
    const { email, digitnumber } = body;
    const data = await confirmation(email, digitnumber);
    res.status(data.status.code).json(data);
  },
  forgotPassword: async function (req: Request, res: Response) {
    const body = req.body;
    const data = await forgotPassword(body);
    res.status(data.status.code).json(data);
  },
  loginFacebook: async function (req: Request & {user: any}, res: Response) {
    console.log("req", req.user)
    const data = await loginFacebook(req.user);
    res.status(data.status.code).json(data);
  },
  loginGoogle: async function (req: Request & {user: any}, res: Response) {
    console.log("req", req.user)
    const data = await loginGoogle(req.user);
    res.status(data.status.code).json(data);
  },
  handleFailed: async function (err: Errback, req: Request, res: Response, next: NextFunction) {
    res.status(500).json({
      data: err,
      status: {
        code: 500,
        message: "Failure!",
        success: false,
      },
    });
  },
  loginPocket: async function (req: Request, res: Response) {
    const body = req.body;
    const { access_token } = body;
    const data = await loginPocket(access_token);
    res.status(data.status.code).json(data);
  },
  updateUserProfile: async function (req: Request, res: Response) {
    let body = req.body;
    const user = res.locals.user;
    body = await excludeFields(body);
    delete body.RoleId;
    delete body.blocked;
    const data = await updateUser(user.id, body);
    res.status(data.status.code).json(data);
  },
  uploadAvatar: async function (req: Request, res: Response) {
    let body = req.body;
    const user = res.locals.user;
    const data = await uploadAvatar(user.id, {...body});
    res.status(data.status.code).json(data);
  },
  sendMailContact: async function (req: Request, res: Response) {
    const body = req.body;
    const data = await sendMailContact(body);
    res.status(data.status.code).json(data);
  },
  redirectFacebook: async function (req: Request, res: Response) {
    res.writeHead(301, {
      Location: `https://demo.truyenhinhkhoinghiep.com/auth/login?type=Facebook&code=${req.query.code}`
    }).end();
  },
  redirectGoogle: async function (req: Request, res: Response) {
    res.writeHead(301, {
      Location: `https://demo.truyenhinhkhoinghiep.com/auth/login?type=Google&code=${req.query.code}`
    }).end();
  },
};

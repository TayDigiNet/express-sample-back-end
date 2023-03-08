import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";
import { JWT_SECRET } from "../configs/constants";
// import PermissionDTO from "../dto/permission.dto";
// import PermissionRepository from "../repository/permission.repository";
import RoleRepository from "../repository/role.repository";
import UserRepository from "../repository/user.repository";
import { JwtPayload, RoleType } from "../typings";

export default class PermissionMiddleware {
  private User = new UserRepository();
  private Role = new RoleRepository();
  // private Permission = new PermissionRepository();
  constructor() {}

  role(roles?: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { headers, method } = req;
      const token = headers.authorization;
      if(!roles){
        if(token){
          const jwt = token.split(" ")[1];
          try {
            const decoded = JWT.verify(jwt, JWT_SECRET) as JwtPayload;
            const { userId, roleId } = decoded;
  
            /** Check exist user */
            const user = await this.User.getOne(userId);
            res.locals.user = user;
          } catch (error) {
          }
        }
        next();
      }
      else{
        if (!token)
          return res.status(403).json({
            data: null,
            status: {
              code: 403,
              message: "Unauthorized!",
              success: false,
            },
          });
        const jwt = token.split(" ")[1];
        try {
          const decoded = JWT.verify(jwt, JWT_SECRET) as JwtPayload;
          const { userId, roleId } = decoded;

          /** Check exist user */
          const user = await this.User.getOne(userId);
          if (!user)
            return res.status(403).json({
              data: null,
              status: {
                code: 403,
                message: "Unauthorized!",
                success: false,
              },
            });

          /** Check user permissions */
          const roleRecords = await this.Role.getRoles(roles);
          const roleIds = roleRecords.map((r) => r.id);
          if (!roleIds.includes(roleId))
            return res.status(406).json({
              data: null,
              status: {
                code: 406,
                message: "No Permissions!",
                success: false,
              },
            });
          res.locals.user = user;
          next();
        } catch (error) {
          return res.status(401).json({
            data: null,
            status: {
              code: 403,
              message: "Unauthorized!",
              success: false,
            },
          });
        }
    }
    };
  }
}

/** Check permissions at tableName */
// const userPermissions = await this.Permission.getPermissionsByRoleId(
//   roleId
// );
// const userPermissionAtTableName = userPermissions.find(
//   (permission) => permission.tableName === this.tableName
// );
// if (!userPermissionAtTableName)
//   return res.status(406).json({
//     data: null,
//     status: {
//       code: 406,
//       message: "No Permissions!",
//       success: false,
//     },
//   });
// switch (method) {
//   case "GET":
//     if (userPermissionAtTableName.read) return next();
//     else
//       return res.status(406).json({
//         data: null,
//         status: {
//           code: 406,
//           message: "No Permissions!",
//           success: false,
//         },
//       });
//   case "POST":
//     if (userPermissionAtTableName.create) return next();
//     else
//       return res.status(406).json({
//         data: null,
//         status: {
//           code: 406,
//           message: "No Permissions!",
//           success: false,
//         },
//       });
//   case "PUT":
//     if (userPermissionAtTableName.update) return next();
//     else
//       return res.status(406).json({
//         data: null,
//         status: {
//           code: 406,
//           message: "No Permissions!",
//           success: false,
//         },
//       });
//   case "PATCH":
//     if (userPermissionAtTableName.update) return next();
//     else
//       return res.status(406).json({
//         data: null,
//         status: {
//           code: 406,
//           message: "No Permissions!",
//           success: false,
//         },
//       });
//   case "DELETE":
//     if (userPermissionAtTableName.delete) return next();
//     else
//       return res.status(406).json({
//         data: null,
//         status: {
//           code: 406,
//           message: "No Permissions!",
//           success: false,
//         },
//       });
//   default:
//     return res.status(406).json({
//       data: null,
//       status: {
//         code: 406,
//         message: "No Permissions!",
//         success: false,
//       },
//     });
// }

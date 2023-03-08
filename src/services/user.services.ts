import UserRepository from "../repository/user.repository";
import { QueryOptions } from "./../dto/typings.dto";
import UserDTO, { UserUpdateInforInput,ExcludeFields } from "../dto/user.dto";
import { deleteObjectByKeys, toSlug } from "../helpers/utils";
import { Pagination, ResponseEntry } from "../typings";
import { PROVIDER } from "../configs/constants";
const fs = require('fs');
const path = require('path');
import { hash, verify } from "argon2";

export async function updateUserInfor(
  id: number,
  data: Partial<UserUpdateInforInput>
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  try {
    const record = await User.updateUserInfor(id, data);
    return {
      data: record as UserDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function getUsers(
  query: any,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<UserDTO[]>> {
  const User = new UserRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<
      QueryOptions
    > = queryOptions;
    /** Query data */
    const users = await User.getUsers(options);

    if(queryOptions.limit != null && queryOptions.offset != null){
      /** Get pagination */
      const pageSize = users.rows.length;
      const pageCount = Math.ceil(users.count / queryOptions.limit);
      const pagination: Pagination = {
        count: users.count,
        page: parseInt(query.pagination.page, 10),
        pageCount,
        pageSize,
      };
      meta = {
        pagination,
      };
    }
    return {
      data: users.rows as UserDTO[],
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
      meta: meta,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function getUserById(
  id: number,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  try {
    let options: Partial<QueryOptions & {id: number, UserId?: number }> = queryOptions;
    options.id = id;
    const user: any = await User.getUserById(options);
    // try {
    //   redis.setEx(`user:${id}`, 3600, JSON.stringify(user.dataValues));
    // } catch (error) {
    //   console.error(error);
    // }
    return {
      data: user as UserDTO,
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function createUser(
  data: UserUpdateInforInput,
  user: UserDTO
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  try {

    if(data.password === undefined || data.email === undefined){
      return {
        data: null,
        status: {
          code: 406,
          message: "The password and email fields are required.",
          success: false,
        },
      };
    }
    const existUser = await User.getOneByEmail(data.email || "", PROVIDER.SYSTEM);
    if(existUser){
      return {
        data: null,
        status: {
          code: 403,
          message: "Existed user!",
          success: false,
        },
      };
    }
    const hashPassword = await hash(data.password || "");
    data.username = data.email;
    data.password = hashPassword;
    data.provider = PROVIDER.SYSTEM;
    const user = await User.createUser({
      ...data,
    });
    return {
      data: user as UserDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateUser(
  id: number,
  data: UserUpdateInforInput
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  try {
    // update user
    const user = await User.updateUser(id, data);
    // remove banner file
    return {
      data: user as UserDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateUserFields(
  id: number,
  data: Partial<UserUpdateInforInput>
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  try {
    // update user
    const user = await User.updateUser(id, data);
    // remove banner file
    return {
      data: user as UserDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function deleteUser(id: number): Promise<ResponseEntry<boolean>> {
  const User = new UserRepository();
  try {
    const result = await User.deleteUser(id);
    if (!result)
      return {
        data: false,
        status: {
          code: 406,
          message: "Not Acceptable or Record do not exist",
          success: false,
        },
      };
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: false,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function blockUser(
  id: number,
  data: Partial<UserUpdateInforInput>
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  try {
    const {blocked} = data;
    if(blocked === undefined){
      return {
        data: null,
        status: {
          code: 406,
          message: "The blocked is required.",
          success: false,
        },
      };
    }
    // update user
    const user = await User.updateUser(id, {blocked});
    // remove banner file
    return {
      data: user as UserDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function excludeFields(
  data: Partial<UserUpdateInforInput>
): Promise<Partial<UserUpdateInforInput>> {
  // excluse some fields
  delete data.username;
  delete data.email;
  delete data.password;
  delete data.avatar;
  delete data.provider;
  delete data.confirmed;
  delete data.provider_id;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
}

export async function uploadAvatar(
  id: number,
  data: Partial<UserUpdateInforInput>
): Promise<ResponseEntry<UserDTO | null>> {
  const User = new UserRepository();
  try {
    const olduser = await User.getOne(id);
    const {imageAvatarDimensions, imageAvatarMineType, imageAvatarName, imageAvatarOriginalName, imageAvatarPath, imageAvatarSize} = data;
    let pathAvatar = "";
    if(imageAvatarName === undefined){
      return {
        data: null,
        status: {
          code: 406,
          message: "Missing avatar file.",
          success: false,
        },
      };
    }
    if(olduser && olduser.imageAvatarName){
      pathAvatar = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_USERS, olduser.imageAvatarName);
    }
    // update user
    let user = await User.updateUser(id, {imageAvatarDimensions, imageAvatarMineType, imageAvatarName, imageAvatarOriginalName, imageAvatarPath, imageAvatarSize});
    // remove avatar file
    if(pathAvatar){
      try{
        fs.unlinkSync(pathAvatar);
      }catch(error){
        console.error(error);
      }
    }
    user = deleteObjectByKeys(user?.dataValues, ExcludeFields);
    return {
      data: user as UserDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}
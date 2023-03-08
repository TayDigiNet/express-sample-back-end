import { v4 as uuidv4 } from "uuid";
import { Pagination, ResponseEntry } from "../typings";
const sharp = require('sharp');
import JsonWebToken from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRESIN,
  JWT_REFETCH_SECRET,
  JWT_SECRET,
  REFETCH_TOKEN_EXPIRESIN
} from "../configs/constants";

export function toSlug(str: string) {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str
    .normalize("NFD") // chuyển chuỗi sang unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, ""); // xóa các ký tự dấu sau khi tách tổ hợp

  // Thay ký tự đĐ
  str = str.replace(/[đĐ]/g, "d");

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, "-");

  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, "-");

  // xóa phần dư - ở đầu & cuối
  str = str.replace(/^-+|-+$/g, "");

  const idstring = uuidv4();
  const idArray = idstring.split("-");
  // return
  return str + "-" + idArray[idArray.length - 1];
}

export async function resizeImage(buffer: any, toPath: string){
  let result = await sharp(buffer)
    .resize(1400, 1400, { // size image 300x300
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .toFile(toPath);
    return result;
}

export function validateImage(file: any): ResponseEntry<boolean>{
  let size = parseInt(process.env.SIZE_IMAGE || "0", 0) * 1024 * 1024;
  if(file.size > size){
    return {
      data: false,
      status: {
        code: 406,
        message: "The image size can't be larger than 10MB",
        success: false,
      }};
  }
  else{
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    }
  }
}

export function deleteObjectByKeys(data: any, keys: string[]){
  if(keys){
    keys.forEach(function (value) {
      delete data[value];
    }); 
  }
  return data;
}

export function GenerateToken(existUser: any){
  /** Generate token */
  const jwtPayload = { userId: existUser.id, roleId: existUser.RoleId };
  const token = JsonWebToken.sign(jwtPayload, JWT_SECRET, {
    expiresIn: `${ACCESS_TOKEN_EXPIRESIN}m`,
  });
  const refetchToken = JsonWebToken.sign(jwtPayload, JWT_REFETCH_SECRET, {
    expiresIn: `${REFETCH_TOKEN_EXPIRESIN}m`,
  });
  return {
    token, refetchToken
  }
}
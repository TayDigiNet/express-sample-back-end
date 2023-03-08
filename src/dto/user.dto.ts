import RoleDTO from "./role.dto";

export default interface UserDTO {
  id: number;
  username: string;
  password?: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  full_name?: string;
  nick_name?: string;
  cccd?: string;
  birthday?: string;
  phone?: string;
  address?: string;
  address_temp?: string;
  company?: string;
  company_position_in?: string;
  company_address?: string;
  tax_code?: string;
  request_member_card?: string;
  RoleId: string;
  role: RoleDTO;
  expired_at?: Date;
  digit_number?: string;
  provider_id?: string;
  imageAvatarName?: string;
  imageAvatarPath?: string;
  imageAvatarSize?: string;
  imageAvatarMineType?: string;
  imageAvatarOriginalName?: string;
  imageAvatarDimensions?: string;
  dataValues?: any;
}

export interface UserUpdateInforInput {
  provider?: string;
  full_name?: string;
  nick_name?: string;
  password?: string;
  cccd?: string;
  birthday?: string;
  confirmed?: boolean;
  phone?: string;
  address?: string;
  address_temp?: string;
  company?: string;
  company_position_in?: string;
  company_address?: string;
  tax_code?: string;
  request_member_card?: string;
  expired_at?: Date;
  digit_number?: string;
  email?: string;
  username?: string;
  avatar?: string;
  blocked?: boolean;
  provider_id?: string;
  RoleId?: string;
  createdAt?: string;
  updatedAt?: string;
  imageAvatarName?: string;
  imageAvatarPath?: string;
  imageAvatarSize?: string;
  imageAvatarMineType?: string;
  imageAvatarOriginalName?: string;
  imageAvatarDimensions?: string;
}

export const PublicUserDTO= ["id","username", "email","full_name"];
export const ExcludeFields = ["password","expired_at", "digit_number"];

export interface ContactInput {
  email: string,
  message: string,
  notified: boolean,
  currentDate: string
}
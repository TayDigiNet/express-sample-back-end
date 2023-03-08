export default interface UserEntity {
  id: number;
  username: string;
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
  password?: string;
  RoleId: number;
  expired_at?: Date;
  digit_number?: string;
  provider_id?: string;
  imageAvatarName?: string;
  imageAvatarPath?: string;
  imageAvatarSize?: string;
  imageAvatarMineType?: string;
  imageAvatarOriginalName?: string;
  imageAvatarDimensions?: string;
}
import { Sequelize, Model, DataTypes } from "sequelize";
import { Json } from "sequelize/types/utils";

export function User(sequelize: any) {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider: {
        type: DataTypes.ENUM("system", "google", "facebook", "pocket"),
        allowNull: false,
      },
      confirmed: DataTypes.BOOLEAN,
      blocked: DataTypes.BOOLEAN,
      avatar: DataTypes.STRING,
      full_name: DataTypes.STRING,
      nick_name: DataTypes.STRING,
      cccd: DataTypes.STRING,
      birthday: DataTypes.DATE,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      address_temp: DataTypes.STRING,
      company: DataTypes.STRING,
      company_position_in: DataTypes.STRING,
      company_address: DataTypes.STRING,
      tax_code: DataTypes.STRING,
      request_member_card: DataTypes.STRING,
      expired_at: DataTypes.DATE,
      digit_number: DataTypes.STRING(6),
      provider_id: DataTypes.STRING,
      imageAvatarName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageAvatarPath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageAvatarSize: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageAvatarMineType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageAvatarOriginalName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageAvatarDimensions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
  return User;
}

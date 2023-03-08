import { Sequelize, Model, DataTypes } from "sequelize";

export interface PersonEntity {
  id: number;
  name: string;
  slug?: string;
  position: string;
  phone: string;
  email: string;
  avatar: string;
  imageAvatarName?: string;
  imageAvatarPath?: string;
  imageAvatarSize?: string;
  imageAvatarMineType?: string;
  imageAvatarOriginalName?: string;
  imageAvatarDimensions?: string;
}

export function Person(sequelize: any) {
  const Person = sequelize.define(
    "Person",
    {
      name: { type: DataTypes.STRING,  allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: true },
      position: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
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
  return Person;
}

import { Sequelize, Model, DataTypes } from "sequelize";
import { Json } from "sequelize/types/utils";

export interface IProject {
  id: number;
  name: string;
  slug?: string;
  content: string;
  description: string;
  bannerUrl?: string;
  imageAvatarUrls?: string;
  videoUrls?: string;
  launchDate: string;
  plan: string;
  blocked: boolean;
  viewsCount: number;
  imageAvatarName: string;
  imageAvatarPath: string;
  imageAvatarSize: string;
  imageAvatarMineType: string;
  imageAvatarOriginalName: string;
  imageAvatarDimensions: string;
  published: boolean;
  expiredAt: string;
  requestApproved: boolean;
  requestUpdated: Json;
  draft?: boolean;
}

export function Project(sequelize: any) {
  const Project = sequelize.define(
    "Project",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: true },
      plan: { type: DataTypes.TEXT, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      bannerUrl: { type: DataTypes.STRING, allowNull: true },
      imageUrls: { type: DataTypes.STRING, allowNull: true },
      videoUrls: { type: DataTypes.STRING, allowNull: true },
      launchDate: { type: DataTypes.DATEONLY, allowNull: false },
      blocked: { type: DataTypes.BOOLEAN },
      viewsCount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
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
      published: { type: DataTypes.BOOLEAN, allowNull: false },
      expiredAt: { type: DataTypes.DATEONLY, allowNull: false },
      requestApproved: { type: DataTypes.BOOLEAN, allowNull: false },
      requestUpdated: { type: DataTypes.JSON, allowNull: true },
      draft: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
      timestamps: true,
    },
    {indexes:[{unique:true, fields: ['slug']}]}
  );
  return Project;
}

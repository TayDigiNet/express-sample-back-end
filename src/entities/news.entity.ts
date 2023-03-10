import { Sequelize, Model, DataTypes } from "sequelize";

export default interface NewsEntity {
  id: number;
  name: string;
  description: string;
  bannerUrl?: string;
  slug?: string;
  content: string;
  published: boolean;
  imageBannerName?: string;
  imageBannerPath?: string;
  imageBannerSize?: string;
  imageBannerMineType?: string;
  imageBannerOriginalName?: string;
  imageBannerDimensions?: string;
  draft?: boolean;
  viewsCount: number;
  sharedCount: number;
}

export function News(sequelize: any) {
  const News = sequelize.define(
    "News",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1234),
        allowNull: false,
      },
      bannerUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      published: { type: DataTypes.BOOLEAN, allowNull: false },
      imageBannerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageBannerPath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageBannerSize: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageBannerMineType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageBannerOriginalName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageBannerDimensions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      draft: { type: DataTypes.BOOLEAN, allowNull: true },
      viewsCount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      sharedCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    { indexes: [{ unique: true, fields: ["slug"] }] }
  );
  return News;
}

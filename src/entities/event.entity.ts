import { Sequelize, Model, DataTypes } from "sequelize";

export default interface EventEntity {
  id: number;
  name: string;
  bannerUrl?: string;
  imageUrls?: string;
  startedDateAt: string;
  endedDateAt: string;
  price?: number;
  location: string;
  content: string;
  slug?: string;
  viewsCount?: number;
  playVideoCount?: number;
  published: boolean;
  draft: boolean;
}

export function Event(sequelize: any) {
  const Event = sequelize.define(
    "Event",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: true },
      bannerUrl: { type: DataTypes.STRING, allowNull: true },
      imageUrls: { type: DataTypes.STRING, allowNull: true },
      startedDateAt: { type: DataTypes.DATE, allowNull: false },
      endedDateAt: { type: DataTypes.DATE, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: true },
      location: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      viewsCount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      playVideoCount: { type: DataTypes.INTEGER, allowNull: true , defaultValue: 0},
      published: { type: DataTypes.BOOLEAN, allowNull: false },
      draft: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
      timestamps: true,
    },
    {indexes:[{unique:true, fields: ['slug']}]}
  );
  return Event;
}

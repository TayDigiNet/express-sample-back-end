import { Sequelize, Model, DataTypes } from "sequelize";

export default interface EventCategoryEntity {
  id: number;
  name: string;
  sort: number;
}

export function EventCategory(sequelize: any) {
  const EventCategory = sequelize.define("EventCategory", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return EventCategory;
}

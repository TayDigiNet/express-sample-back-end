import { Sequelize, Model, DataTypes } from "sequelize";

export default interface CategoryEntity {
  id: number;
  name: string;
  sort: number;
}

export function Category(sequelize: any) {
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Category;
}

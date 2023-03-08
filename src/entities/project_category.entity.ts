import { Sequelize, Model, DataTypes } from "sequelize";

export default interface ProjectCategoryEntity {
  id: number;
  name: string;
  sort: number;
}

export function ProjectCategory(sequelize: any) {
  const ProjectCategory = sequelize.define("ProjectCategory", {
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
  return ProjectCategory;
}

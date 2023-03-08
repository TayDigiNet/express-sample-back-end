import { Sequelize, Model, DataTypes } from "sequelize";

export function ProjectOperators(sequelize: any) {
  const ProjectOperators = sequelize.define(
    "ProjectOperators",
    {},
    { timestamps: false }
  );
  return ProjectOperators;
}

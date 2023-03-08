import { Sequelize, Model, DataTypes } from "sequelize";

export function Role(sequelize: any) {
  const Role = sequelize.define("Role", {
    name: {
      type: DataTypes.ENUM,
      values: ["user", "projecter", "admin"],
      allowNull: false,
    },
  });
  return Role;
}

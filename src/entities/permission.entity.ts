import { Sequelize, Model, DataTypes } from "sequelize";

export default interface PermissionEntity {
  id: number;
  tableName: string;
  create: boolean;
  update: boolean;
  read: boolean;
  delete: boolean;
}

export function Permission(sequelize: any) {
  const Permission = sequelize.define("Permission", {
    tableName: {
      type: DataTypes.ENUM,
      values: ["user", "news"],
      allowNull: false,
    },
    create: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    update: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    delete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  return Permission;
}

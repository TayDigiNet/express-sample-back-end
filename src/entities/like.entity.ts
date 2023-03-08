import { Sequelize, Model, DataTypes } from "sequelize";

export default interface LikeEntity {
  id: number;
}

export function Like(sequelize: any) {
  const Like = sequelize.define("Like", {
  });
  return Like;
}
import { Sequelize, Model, DataTypes } from "sequelize";

export default interface CommentEntity {
  id: number;
}

export function Comment(sequelize: any) {
  const Comment = sequelize.define("Comment", {
    content: { type: DataTypes.TEXT, allowNull: false },
  });
  return Comment;
}
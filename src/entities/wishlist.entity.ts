import { Sequelize, Model, DataTypes } from "sequelize";

export default interface WishlistEntity {
  id: number;
}

export function Wishlist(sequelize: any) {
  const Wishlist = sequelize.define("Wishlist", {
  });
  return Wishlist;
}
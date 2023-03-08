import { Sequelize, Model, DataTypes } from "sequelize";

export default interface ContactEntity {
  id: number;
  email: string;
}

export function Contact(sequelize: any) {
  const Contact = sequelize.define("Contact", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {indexes:[{unique:true, fields: ['email']}]});
  return Contact;
}

import { User } from "./user.entity";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { ROLE } from "../configs/constants";
import readValueJsonFile from "../helpers/readValueJsonFile";
import path from "path";
import { Category } from "./category.entity";
import { News } from "./news.entity";
import { Event } from "./event.entity";
import { Person } from "./person.entity";
import { Project } from "./project.entity";
import { ProjectOperators } from "./project_operators.entity";
import { ProjectCategory } from "./project_category.entity";
import { ProjectImage } from "./project_image.entity";
import { EventImage } from "./event_image.entity";
import { Wishlist } from "./wishlist.entity";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";
import { EventCategory } from "./event_category.entity";
import { Contact } from "./contact.entity";
const { Sequelize } = require("sequelize");

export default class DBContext {
  private static db: any;
  constructor() {}
  static connect() {
    const sequelize = new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: process.env.NODE_ENV === 'PRODUCTION' ? false : true
      }
    );

    /** init tables */
    this.db = {
      sequelize: sequelize,
      users: User(sequelize),
      role: Role(sequelize),
      permissions: Permission(sequelize),
      category: Category(sequelize),
      news: News(sequelize),
      event: Event(sequelize),
      person: Person(sequelize),
      project: Project(sequelize),
      projectOperators: ProjectOperators(sequelize),
      projectCategory: ProjectCategory(sequelize),
      projectImage: ProjectImage(sequelize),
      eventImage: EventImage(sequelize),
      wishlist: Wishlist(sequelize),
      like: Like(sequelize),
      comment: Comment(sequelize),
      eventCategory: EventCategory(sequelize),
      contact: Contact(sequelize)
    };

    /** Foreign Key */

    /**** User and permission */
    this.db.role.hasMany(this.db.users, { as: "users", foreignKey: "RoleId" });
    this.db.users.belongsTo(this.db.role, { as: "role", foreignKey: "RoleId" });

    this.db.role.hasMany(this.db.permissions, {
      as: "permissions",
      foreignKey: "RoleId",
    });
    this.db.permissions.belongsTo(this.db.role, {
      as: "role",
      foreignKey: "RoleId",
    });

    /**** News and category */
    this.db.category.hasMany(this.db.news, {
      as: "news",
      foreignKey: "CategoryId",
    });
    this.db.news.belongsTo(this.db.category, {
      as: "category",
      foreignKey: "CategoryId",
    });

    this.db.users.hasMany(this.db.news, {
      as: "news",
      foreignKey: "CreaterId",
    });
    this.db.news.belongsTo(this.db.users, {
      as: "users",
      foreignKey: "CreaterId",
    });

    /**** Events */
    this.db.users.hasMany(this.db.event, {
      as: "event",
      foreignKey: "CreaterId",
    });
    this.db.event.belongsTo(this.db.users, {
      as: "users",
      foreignKey: "CreaterId",
    });

    /**** Project Person */
    this.db.users.hasMany(this.db.person, {
      as: "person",
      foreignKey: "CreaterId",
    });
    this.db.person.belongsTo(this.db.users, {
      as: "users",
      foreignKey: "CreaterId",
    });

    this.db.users.hasMany(this.db.project, {
      as: "project",
      foreignKey: "CreaterId",
    });
    this.db.project.belongsTo(this.db.users, {
      as: "creater",
      foreignKey: "CreaterId",
    });

    this.db.person.hasMany(this.db.project, {
      as: "project",
      foreignKey: "RepresentativeId",
    });
    this.db.project.belongsTo(this.db.person, {
      as: "representative",
      foreignKey: "RepresentativeId",
    });

    this.db.person.belongsToMany(this.db.project, {
      as: "projectOperators",
      through: this.db.projectOperators,
      foreignKey: "PersonId",
    });
    this.db.project.belongsToMany(this.db.person, {
      as: "projectOperators",
      through: this.db.projectOperators,
      foreignKey: "ProjectId",
    });

    /**** Project and category */
    this.db.projectCategory.hasMany(this.db.project, {
      as: "project",
      foreignKey: "ProjectCategoryId",
    });
    this.db.project.belongsTo(this.db.projectCategory, {
      as: "projectCategory",
      foreignKey: "ProjectCategoryId",
    });
    /**** Project and Image */
    this.db.project.hasMany(this.db.projectImage, {
      onDelete: 'cascade',
      as: "projectImages",
      foreignKey: "ProjectId",
    });
    this.db.projectImage.belongsTo(this.db.project, {
      onDelete: 'cascade',
      as: "project",
      foreignKey: "ProjectId",
    });

    /**** Event and Image */
    this.db.event.hasMany(this.db.eventImage, {
      onDelete: 'cascade',
      as: "eventImages",
      foreignKey: "EventId",
    });
    this.db.eventImage.belongsTo(this.db.event, {
      onDelete: 'cascade',
      as: "event",
      foreignKey: "EventId",
    });

    /**** Project and Wishlist */
    this.db.project.hasMany(this.db.wishlist, {
      onDelete: 'cascade',
      as: "wishlistProjects",
      foreignKey: "ProjectId",
    });
    this.db.wishlist.belongsTo(this.db.project, {
      onDelete: 'cascade',
      as: "project",
      foreignKey: "ProjectId",
    });

    /**** Event and Wishlist */
    this.db.event.hasMany(this.db.wishlist, {
      onDelete: 'cascade',
      as: "wishlistEvents",
      foreignKey: "EventId",
    });
    this.db.wishlist.belongsTo(this.db.event, {
      onDelete: 'cascade',
      as: "event",
      foreignKey: "EventId",
    });

    /**** News and Wishlist */
    this.db.news.hasMany(this.db.wishlist, {
      onDelete: 'cascade',
      as: "wishlistNewses",
      foreignKey: "NewsId",
    });
    this.db.wishlist.belongsTo(this.db.news, {
      onDelete: 'cascade',
      as: "news",
      foreignKey: "NewsId",
    });

    /**** User and Wishlist */
    this.db.users.hasMany(this.db.wishlist, {
      onDelete: 'cascade',
      as: "wishlistUsers",
      foreignKey: "UserId",
    });
    this.db.wishlist.belongsTo(this.db.users, {
      onDelete: 'cascade',
      as: "user",
      foreignKey: "UserId"
    });

    /**** Project and Like */
    this.db.project.hasMany(this.db.like, {
      onDelete: 'cascade',
      as: "likeProjects",
      foreignKey: "ProjectId",
    });
    this.db.like.belongsTo(this.db.project, {
      onDelete: 'cascade',
      as: "project",
      foreignKey: "ProjectId",
    });

    /**** Event and Like */
    this.db.event.hasMany(this.db.like, {
      onDelete: 'cascade',
      as: "likeEvents",
      foreignKey: "EventId",
    });
    this.db.like.belongsTo(this.db.event, {
      onDelete: 'cascade',
      as: "event",
      foreignKey: "EventId",
    });

    /**** News and Like */
    this.db.news.hasMany(this.db.like, {
      onDelete: 'cascade',
      as: "likeNewses",
      foreignKey: "NewsId",
    });
    this.db.like.belongsTo(this.db.news, {
      onDelete: 'cascade',
      as: "news",
      foreignKey: "NewsId",
    });

    /**** User and Like */
    this.db.users.hasMany(this.db.like, {
      onDelete: 'cascade',
      as: "likeUsers",
      foreignKey: "UserId",
    });
    this.db.like.belongsTo(this.db.users, {
      onDelete: 'cascade',
      as: "user",
      foreignKey: "UserId"
    });

    /**** Comment and Subcomment */
    this.db.comment.hasMany(this.db.comment, {onDelete: 'cascade', as: "subcomment", foreignKey: 'parentID', targetKey: "id"});
    /**** Project and Comment */
    this.db.project.hasMany(this.db.comment, {
      onDelete: 'cascade',
      as: "commentProjects",
      foreignKey: "ProjectId",
    });
    this.db.comment.belongsTo(this.db.project, {
      onDelete: 'cascade',
      as: "project",
      foreignKey: "ProjectId",
    });

    /**** Event and Comment */
    this.db.event.hasMany(this.db.comment, {
      onDelete: 'cascade',
      as: "commentEvents",
      foreignKey: "EventId",
    });
    this.db.comment.belongsTo(this.db.event, {
      onDelete: 'cascade',
      as: "event",
      foreignKey: "EventId",
    });

    /**** News and Comment */
    this.db.news.hasMany(this.db.comment, {
      onDelete: 'cascade',
      as: "commentNewses",
      foreignKey: "NewsId",
    });
    this.db.comment.belongsTo(this.db.news, {
      onDelete: 'cascade',
      as: "news",
      foreignKey: "NewsId",
    });

    /**** User and Comment */
    this.db.users.hasMany(this.db.comment, {
      onDelete: 'cascade',
      as: "commentUsers",
      foreignKey: "UserId",
    });
    this.db.comment.belongsTo(this.db.users, {
      onDelete: 'cascade',
      as: "user",
      foreignKey: "UserId"
    });

    /**** Event and Category */
    this.db.eventCategory.hasMany(this.db.event, {
      as: "event",
      foreignKey: "EventCategoryId",
    });
    this.db.event.belongsTo(this.db.eventCategory, {
      as: "eventCategory",
      foreignKey: "EventCategoryId",
    });

    return this.db;
  }
  static getConnect() {
    if (this.db) {
      return this.db;
    } else {
      return this.connect();
    }
  }
  static async initValues() {
    try {
      const roles = await this.db.role.findAll();
      const adminRole = roles.find((r: any) => r.name === "admin");
      const userRole = roles.find((r: any) => r.name === "user");
      const projecterRole = roles.find((r: any) => r.name === "projecter");

      const filePath = path.join(__dirname, "../../assets/initialValues.json");
      const initPermission = readValueJsonFile(filePath);

      if (!adminRole) {
        const role = await this.db.role.create({
          name: ROLE.ADMIN,
        });
        for (let i = 0; i < initPermission.permissions.admin.length; i++) {
          await this.db.permissions.create({
            ...initPermission.permissions.admin[i],
            RoleId: role.dataValues.id,
          });
        }
      } else {
        const permissions = await this.db.permissions.findAll({
          where: {
            RoleId: adminRole.dataValues.id,
          },
        });
        if (permissions.length === 0) {
          for (let i = 0; i < initPermission.permissions.admin.length; i++) {
            await this.db.permissions.create({
              ...initPermission.permissions.admin[i],
              RoleId: adminRole.dataValues.id,
            });
          }
        }
      }
      if (!userRole) {
        const role = await this.db.role.create({ name: ROLE.USER });
        for (let i = 0; i < initPermission.permissions.user.length; i++) {
          await this.db.permissions.create({
            ...initPermission.permissions.user[i],
            RoleId: role.dataValues.id,
          });
        }
      } else {
        const permissions = await this.db.permissions.findAll({
          where: {
            RoleId: userRole.dataValues.id,
          },
        });
        if (permissions.length === 0) {
          for (let i = 0; i < initPermission.permissions.user.length; i++) {
            await this.db.permissions.create({
              ...initPermission.permissions.user[i],
              RoleId: userRole.dataValues.id,
            });
          }
        }
      }
      if (!projecterRole) {
        const role = await this.db.role.create({ name: ROLE.PROJECTER });
        for (let i = 0; i < initPermission.permissions.projecter.length; i++) {
          await this.db.permissions.create({
            ...initPermission.permissions.projecter[i],
            RoleId: role.dataValues.id,
          });
        }
      } else {
        const permissions = await this.db.permissions.findAll({
          where: {
            RoleId: projecterRole.dataValues.id,
          },
        });
        if (permissions.length === 0) {
          for (
            let i = 0;
            i < initPermission.permissions.projecter.length;
            i++
          ) {
            await this.db.permissions.create({
              ...initPermission.permissions.projecter[i],
              RoleId: projecterRole.dataValues.id,
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

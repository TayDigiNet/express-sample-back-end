import DBContext from "../entities";
import RoleDTO from "../dto/role.dto";
import RoleInterface from "../interfaces/role.interface";
import { RoleType } from "../typings";
import { Op } from "sequelize";

export default class RoleRepository implements RoleInterface {
  private Role = DBContext.getConnect().role;

  async getRole(
    role: "admin" | "user" | "projecter"
  ): Promise<RoleDTO | undefined> {
    try {
      const roleQuery = await this.Role.findOne({
        where: {
          name: role,
        },
      });
      if (!roleQuery) return undefined;
      return {
        ...roleQuery.dataValues,
      };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getRoles(roles: string[]): Promise<RoleDTO[]> {
    try {
      const query = roles.map((r) => ({
        name: r,
      }));
      const roleQuery = await this.Role.findAll({
        where: {
          [Op.or]: query,
        },
      });
      return roleQuery.map((r: any) => r.dataValues);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

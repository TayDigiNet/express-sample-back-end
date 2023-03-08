import PermissionDTO from "../dto/permission.dto";
import DBContext from "../entities";
import PermissionInterface from "../interfaces/permission.interface";

export default class PermissionRepository implements PermissionInterface {
  private Pemissions = DBContext.getConnect().permissions;

  async getPermissionsByRoleId(roleId: number): Promise<PermissionDTO[]> {
    const permissions = await this.Pemissions.findAll({
      where: {
        RoleId: roleId,
      },
    });
    const result = permissions.map((permission: any) => permission.dataValues);
    return result;
  }

  async getPermissionsByTableName(tableName: string): Promise<PermissionDTO[]> {
    const permissions = await this.Pemissions.findAll({
      where: {
        tableName: tableName,
      },
    });
    const result = permissions.map((permission: any) => permission.dataValues);
    return result;
  }
}

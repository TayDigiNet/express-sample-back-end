import PermissionDTO from "../dto/permission.dto";

export default interface PermissionInterface {
  getPermissionsByRoleId(roleId: number): Promise<PermissionDTO[]>;
  getPermissionsByTableName(tableName: string): Promise<PermissionDTO[]>;
}

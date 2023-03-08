export default interface PermissionDTO {
  id: number;
  tableName: string;
  create: boolean;
  update: boolean;
  read: boolean;
  delete: boolean;
  RoleId: number;
}

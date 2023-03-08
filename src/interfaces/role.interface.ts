import RoleDTO from "../dto/role.dto";
import { RoleType } from "../typings";

export default interface RoleInterface {
  getRole(role: RoleType): Promise<RoleDTO | undefined>;
  getRoles(roles: RoleType[]): Promise<RoleDTO[]>;
}

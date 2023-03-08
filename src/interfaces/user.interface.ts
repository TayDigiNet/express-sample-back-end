import UserEntity from "../entities/user.entity";
import UserDTO, {UserUpdateInforInput} from "../dto/user.dto";
import { QueryOptions, QueryResponse } from "./../dto/typings.dto";

export default interface UserInterface {
  getOne(id: number): Promise<UserDTO | undefined>;
  getOneByEmail(email: string, provider: string): Promise<UserDTO | undefined>;
  create(data: Partial<UserEntity>): Promise<UserDTO | undefined>;
  getUsers(
    data?: Partial<QueryOptions & { CategoryId: number; CreaterId: number }>
  ): Promise<QueryResponse<UserDTO>>;
  getUserById(data?: Partial<QueryOptions & { id: number }>): Promise<UserDTO | undefined>;
  createUser(
    data: UserUpdateInforInput & { slug: string; CreaterId: number }
  ): Promise<UserDTO | undefined>;
  updateUser(
    id: number,
    data: Partial<UserUpdateInforInput>
  ): Promise<UserDTO | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUserByProvider(id: string, provider: string): Promise<UserDTO | undefined>;
}

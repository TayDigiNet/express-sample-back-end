import DBContext from "../entities";
import UserEntity from "../entities/user.entity";
import UserInterface from "../interfaces/user.interface";
import UserDTO, { UserUpdateInforInput } from "../dto/user.dto";
import { QueryOptions, QueryResponse } from "./../dto/typings.dto";
import { Op } from "sequelize";

export default class UserRepository implements UserInterface {
  private Users = DBContext.getConnect().users;
  private Role = DBContext.getConnect().role;

  async getOne(id: number): Promise<UserDTO | undefined> {
    const user = await this.Users.findOne({
      where: {
        id,
      },
      include: { model: this.Role, as: "role" }
    });
    if (!user) return undefined;
    return {
      ...user.dataValues,
    };
  }

  async getOneByEmail(email: string, provider: string, options: any = {}): Promise<UserDTO | undefined> {
    const user = await this.Users.findOne({
      where: {
        email: email,
        provider: provider
      },
      include: { model: this.Role, as: "role" }
    });
    if (!user) return undefined;
    return {
      ...user.dataValues,
    };
  }

  async create(data: Partial<UserEntity>): Promise<UserDTO | undefined> {
    try {
      const user = await this.Users.create({
        ...data,
      });
      return { ...user.dataValues };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async updateUserInfor(
    id: number,
    data: Partial<UserUpdateInforInput>
  ): Promise<UserDTO | undefined> {
    const record = await this.Users.findByPk(id);
    await record.update({
      ...data,
    });
    return record;
  }

  async getUsers(
    data?: Partial<QueryOptions & { CategoryId: number; CreaterId: number; ToDate: Date; FromDate: Date, all: string }>
  ): Promise<QueryResponse<UserDTO>> {
    let includes: any = [];
    let filters: any = {};
    let query: any = {};
    if (typeof data?.search === "string") {
      filters[Op.or] = [
        {
          username: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          email: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          provider: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          full_name: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          nick_name: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          cccd: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          phone: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          address: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          address_temp: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          company_position_in: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          company_address: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          tax_code: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          request_member_card: {
            [Op.like]: "%" + data.search + "%",
          },
        }
      ];
    }
    let sort: any = [];
    if (typeof data?.sort !== "undefined") {
      sort = data.sort.map((s) => [s.sortColumn, s.sortType]);
    } else {
      sort = [["updatedAt", "desc"]];
    }

    query = {
      where: filters,
      order: sort,
      include: includes
    }
    if(data && data.offset != null && data.limit != null){
      query.offset = data.offset;
      query.limit = data.limit;
    }
    const users = await this.Users.findAndCountAll(query);
    return users;
  }

  async getUserById(data?: Partial<QueryOptions & { id: number, UserId: number }>): Promise<UserDTO | undefined> {
    let includes: any = [];
    const user = await this.Users.findByPk(data?.id, {include: includes});
    return user;
  }

  async createUser(
    data: UserUpdateInforInput
  ): Promise<UserDTO | undefined> {
    const newUser = await this.Users.create({
      ...data,
    });
    return newUser;
  }

  async updateUser(
    id: number,
    data: Partial<UserUpdateInforInput>
  ): Promise<UserDTO | undefined> {
    const user = await this.Users.findByPk(id);
    await user.update({
      ...data,
    });
    return user;
  }
  async deleteUser(id: number): Promise<boolean> {
    const detroy = await this.Users.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }

  async getUserByProvider(id: string, provider: string): Promise<UserDTO | undefined> {
    const user = await this.Users.findOne({
      where: {
        provider_id: id,
        provider: provider
      },
      include: { model: this.Role, as: "role" }
    });
    if (!user) return undefined;
    return {
      ...user.dataValues,
    };
  }
}

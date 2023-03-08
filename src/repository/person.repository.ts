import { QueryOptions, QueryResponse } from "./../dto/typings.dto";
import DBContext from "../entities";
import { Op } from "sequelize";
import PersonInterface from "../interfaces/person.interface";
import PersonDTO, { PersonInput } from "../dto/person.dto";

export default class PersonRepository implements PersonInterface {
  private Person = DBContext.getConnect().person;

  async getPeople(
    data?: Partial<QueryOptions & { CreaterId: number }>
  ): Promise<QueryResponse<PersonDTO>> {
    let filters: any = {};
    let query: any = {};
    if (typeof data?.search === "string") {
      filters[Op.or] = [
        {
          name: {
            [Op.like]: "%" + data.search + "%",
          },
        },
      ];
    }
    if (typeof data?.CreaterId === "number") {
      filters.CreaterId = data.CreaterId;
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
      distinct: true
    }
    if(data && data.offset && data.limit){
      query.offset = data.offset;
      query.limit = data.limit;
    }

    const responses = await this.Person.findAndCountAll(query);
    return responses;
  }

  async getPersonById(id: number): Promise<PersonDTO | undefined> {
    const record = await this.Person.findByPk(id);
    return record;
  }

  async createPerson(
    data: PersonInput & { slug: string; CreaterId: number }
  ): Promise<PersonDTO | undefined> {
    const newRecord = await this.Person.create({
      ...data,
    });
    return newRecord;
  }

  async updatePerson(
    id: number,
    data: Partial<PersonInput>
  ): Promise<PersonDTO | undefined> {
    const record = await this.Person.findByPk(id);
    await record.update({
      ...data,
    });
    return record;
  }
  async deletePerson(id: number): Promise<boolean> {
    const detroy = await this.Person.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

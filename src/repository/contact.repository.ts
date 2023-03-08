import { QueryOptions, QueryResponse } from "../dto/typings.dto";
import DBContext from "../entities";
import { Op } from "sequelize";
import ContactInterface from "../interfaces/contact.interface";
import ContactDTO, { ContactInput } from "../dto/contact.dto";
import { PublicUserDTO } from "../dto/user.dto";

export default class ContactRepository implements ContactInterface {
  private Contact = DBContext.getConnect().contact;
  private Users = DBContext.getConnect().users;
  private Event = DBContext.getConnect().event;
  private Project = DBContext.getConnect().project;
  private News = DBContext.getConnect().news;

  async getContacts(
    data?: Partial<QueryOptions & {eventId?: number, projectId?: number, newsId?: number}>
  ): Promise<QueryResponse<ContactDTO>> {
    let includes: any = [];
    let filters: any = {};
    let query: any = {};
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
    const responses = await this.Contact.findAndCountAll(query);
    return responses;
  }

  async getContactById(data?: Partial<QueryOptions & { id?: number, UserId: number, EventId?: number, ProjectId?: number, NewsId?: number }>): Promise<ContactDTO | undefined> {
    let includes: any = [];
    let filters: any = {};
  
    if(data?.id !== undefined){
      filters.id = data.id;
    }
    const record = await this.Contact.findOne({
      where: filters,
      include: includes
    });
    return record;
  }

  async createContact(
    data: ContactInput
  ): Promise<ContactDTO | undefined> {
    const newRecord = await this.Contact.create({
      ...data
    });
    return newRecord;
  }

  async updateContact(
    id: number,
    data: Partial<ContactInput>
  ): Promise<ContactDTO | undefined> {
    let record = await this.Contact.findByPk(id);
    if(!record){
      throw "Not found the contact";
    }
    await record.update({
      ...data,
    });
    record = await this.Contact.findByPk(id);
    return record;
  }
  async deleteContact(id: number, userId: number): Promise<boolean> {
    const detroy = await this.Contact.destroy({
      where: {
        id,
        UserId: userId
      },
    });
    return detroy;
  }
}

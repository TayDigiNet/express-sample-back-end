import { QueryOptions, QueryResponse } from "../dto/typings.dto";
import DBContext from "../entities";
import { Op } from "sequelize";
import WishlistInterface from "../interfaces/wishlist.interface";
import WishlistDTO, { WishlistInput } from "../dto/wishlist.dto";
import { PublicUserDTO } from "../dto/user.dto";

export default class WishlistRepository implements WishlistInterface {
  private Wishlist = DBContext.getConnect().wishlist;
  private Users = DBContext.getConnect().users;
  private Event = DBContext.getConnect().event;
  private Project = DBContext.getConnect().project;
  private News = DBContext.getConnect().news;

  async getWishlists(
    data?: Partial<QueryOptions & {id?: number, UserId: number, isEvent?: number, isProject?: number, isNews?: number }>
  ): Promise<QueryResponse<WishlistDTO>> {
    let includes: any = [];
    let filters: any = {};
    let query: any = {};
    let sort: any = [];
    if (typeof data?.sort !== "undefined") {
      sort = data.sort.map((s) => [s.sortColumn, s.sortType]);
    } else {
      sort = [["updatedAt", "desc"]];
    }

    if (typeof data?.populate !== "undefined") {
      if (data?.populate === "*") {
        includes = [
          { model: this.Users, as: "user", attributes: PublicUserDTO },
          { model: this.Event, as: "event" },
          { model: this.Project, as: "project" },
          { model: this.News, as: "news" }
        ];
      } else {
        if (data?.populate.includes("user")) {
          includes = [
            ...includes,
            { model: this.Users, as: "user", attributes: PublicUserDTO },
          ];
        }
        if (data?.populate.includes("event")) {
          includes = [
            ...includes,
            { model: this.Event, as: "event" },
          ];
        }
        if (data?.populate.includes("project")) {
          includes = [
            ...includes,
            { model: this.Project, as: "project" },
          ];
        }
        if (data?.populate.includes("news")) {
          includes = [
            ...includes,
            { model: this.News, as: "news" },
          ];
        }
      }
    }
    filters.UserId = data?.UserId;
    if(data?.isEvent !== undefined){
      filters.EventId = {
        [Op.not]: null,
      };
    }
    if(data?.isProject !== undefined){
      filters.ProjectId = {
        [Op.not]: null,
      };
    }
    if(data?.isNews !== undefined){
      filters.NewsId = {
        [Op.not]: null,
      };
    }
    query = {
      where: filters,
      order: sort,
      include: includes,
      distinct: true
    }
    if(data && data.offset != null && data.limit != null){
      query.offset = data.offset;
      query.limit = data.limit;
    }
    const responses = await this.Wishlist.findAndCountAll(query);
    return responses;
  }

  async getWishlistById(data?: Partial<QueryOptions & { id?: number, UserId: number, EventId?: number, ProjectId?: number, NewsId?: number }>): Promise<WishlistDTO | undefined> {
    let includes: any = [];
    let filters: any = {};
    if (typeof data?.populate !== "undefined") {
      if (data?.populate === "*") {
        includes = [
          { model: this.Users, as: "users", attributes: PublicUserDTO },
          { model: this.Event, as: "event" },
          { model: this.Project, as: "project" },
          { model: this.News, as: "news" }
        ];
      } else {
        if (data?.populate.includes("users")) {
          includes = [
            ...includes,
            { model: this.Users, as: "users", attributes: PublicUserDTO },
          ];
        }
        if (data?.populate.includes("event")) {
          includes = [
            ...includes,
            { model: this.Event, as: "event" },
          ];
        }
        if (data?.populate.includes("project")) {
          includes = [
            ...includes,
            { model: this.Project, as: "project" },
          ];
        }
        if (data?.populate.includes("news")) {
          includes = [
            ...includes,
            { model: this.News, as: "news" },
          ];
        }
      }
    }
    if(data?.id !== undefined){
      filters.id = data.id;
    }
    else if(data?.EventId !== undefined){
      filters.EventId = data.EventId;
    }
    else if(data?.ProjectId !== undefined){
      filters.ProjectId = data.ProjectId;
    }
    else if(data?.NewsId !== undefined){
      filters.NewsId = data.NewsId;
    }
    const record = await this.Wishlist.findOne({
      where: filters,
      include: includes
    });
    return record;
  }

  async createWishlist(
    data: WishlistInput
  ): Promise<WishlistDTO | undefined> {
    const newRecord = await this.Wishlist.create({
      ...data
    });
    return newRecord;
  }

  async updateWishlist(
    id: number,
    data: Partial<WishlistInput>
  ): Promise<WishlistDTO | undefined> {
    let record = await this.Wishlist.findByPk(id);
    await record.update({
      ...data,
    });
    record = await this.Wishlist.findByPk(id, {include: [
      { model: this.Users, as: "users", attributes: PublicUserDTO },
      { model: this.Event, as: "event" },
      { model: this.Project, as: "project" },
      { model: this.News, as: "news" },
    ]});
    return record;
  }
  async deleteWishlist(id: number, userId: number): Promise<boolean> {
    const detroy = await this.Wishlist.destroy({
      where: {
        id,
        UserId: userId
      },
    });
    return detroy;
  }
}

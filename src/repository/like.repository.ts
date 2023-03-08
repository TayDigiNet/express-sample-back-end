import { QueryOptions, QueryResponse } from "../dto/typings.dto";
import DBContext from "../entities";
import { Op } from "sequelize";
import LikeInterface from "../interfaces/like.interface";
import LikeDTO, { LikeInput } from "../dto/like.dto";
import { PublicUserDTO } from "../dto/user.dto";

export default class LikeRepository implements LikeInterface {
  private Like = DBContext.getConnect().like;
  private Users = DBContext.getConnect().users;
  private Event = DBContext.getConnect().event;
  private Project = DBContext.getConnect().project;
  private News = DBContext.getConnect().news;

  async getLikes(
    data?: Partial<QueryOptions & {id?: number, UserId: number, isEvent?: number, isProject?: number, isNews?: number }>
  ): Promise<QueryResponse<LikeDTO>> {
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
    const responses = await this.Like.findAndCountAll(query);
    return responses;
  }

  async getLikeById(data?: Partial<QueryOptions & { id?: number, UserId: number, EventId?: number, ProjectId?: number, NewsId?: number }>): Promise<LikeDTO | undefined> {
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
    const record = await this.Like.findOne({
      where: filters,
      include: includes
    });
    return record;
  }

  async createLike(
    data: LikeInput
  ): Promise<LikeDTO | undefined> {
    const newRecord = await this.Like.create({
      ...data
    });
    return newRecord;
  }

  async updateLike(
    id: number,
    data: Partial<LikeInput>
  ): Promise<LikeDTO | undefined> {
    let record = await this.Like.findByPk(id);
    await record.update({
      ...data,
    });
    record = await this.Like.findByPk(id, {include: [
      { model: this.Users, as: "users", attributes: PublicUserDTO },
      { model: this.Event, as: "event" },
      { model: this.Project, as: "project" },
      { model: this.News, as: "news" },
    ]});
    return record;
  }
  async deleteLike(id: number, userId: number): Promise<boolean> {
    const detroy = await this.Like.destroy({
      where: {
        id,
        UserId: userId
      },
    });
    return detroy;
  }
}

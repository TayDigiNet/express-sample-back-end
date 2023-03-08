import { QueryOptions, QueryResponse } from "../dto/typings.dto";
import DBContext from "../entities";
import { Op } from "sequelize";
import CommentInterface from "../interfaces/comment.interface";
import CommentDTO, { CommentInput } from "../dto/comment.dto";
import { PublicUserDTO } from "../dto/user.dto";

export default class CommentRepository implements CommentInterface {
  private Comment = DBContext.getConnect().comment;
  private Users = DBContext.getConnect().users;
  private Event = DBContext.getConnect().event;
  private Project = DBContext.getConnect().project;
  private News = DBContext.getConnect().news;

  async getComments(
    data?: Partial<QueryOptions & {eventId?: number, projectId?: number, newsId?: number}>
  ): Promise<QueryResponse<CommentDTO>> {
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
    includes = [
      ...includes,
      { model: this.Comment, as: "subcomment", include: { model: this.Users, as: "user", attributes: PublicUserDTO } },
    ];
    
    filters.parentID = null;
    if(data?.eventId !== undefined){
      filters.EventId = data?.eventId;
    }
    if(data?.projectId !== undefined){
      filters.ProjectId = data.projectId;
    }
    if(data?.newsId !== undefined){
      filters.NewsId = data?.newsId;
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
    const responses = await this.Comment.findAndCountAll(query);
    return responses;
  }

  async getCommentById(data?: Partial<QueryOptions & { id?: number, UserId: number, EventId?: number, ProjectId?: number, NewsId?: number }>): Promise<CommentDTO | undefined> {
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
    const record = await this.Comment.findOne({
      where: filters,
      include: includes
    });
    return record;
  }

  async createComment(
    data: CommentInput
  ): Promise<CommentDTO | undefined> {
    const newRecord = await this.Comment.create({
      ...data
    });
    return newRecord;
  }

  async updateComment(
    id: number,
    data: Partial<CommentInput>
  ): Promise<CommentDTO | undefined> {
    let record = await this.Comment.findByPk(id);
    if(!record || record.UserId !== data.UserId){
      throw "Not found the comment";
    }
    await record.update({
      ...data,
    });
    record = await this.Comment.findByPk(id, {include: [
      { model: this.Users, as: "user", attributes: PublicUserDTO },
      { model: this.Event, as: "event" },
      { model: this.Project, as: "project" },
      { model: this.News, as: "news" },
      { model: this.Comment, as: "subcomment" }
    ]});
    return record;
  }
  async deleteComment(id: number, userId: number): Promise<boolean> {
    const detroy = await this.Comment.destroy({
      where: {
        id,
        UserId: userId
      },
    });
    return detroy;
  }
}

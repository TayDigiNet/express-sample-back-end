import { QueryOptions, QueryResponse } from "./../dto/typings.dto";
import DBContext from "../entities";
import { Op, Sequelize } from "sequelize";
import EventInterface from "../interfaces/event.interface";
import EventDTO, { EventInput } from "../dto/event.dto";
import { PublicUserDTO } from "../dto/user.dto";

export default class EventRepository implements EventInterface {
  private Event = DBContext.getConnect().event;
  private Users = DBContext.getConnect().users;
  private EventImages = DBContext.getConnect().eventImage;
  private Wishlist = DBContext.getConnect().wishlist;
  private Like = DBContext.getConnect().like;
  private EventCategory = DBContext.getConnect().eventCategory;

  async getEvents(
    data?: Partial<QueryOptions & { CreaterId: number, all: string, published: boolean, EventCategoryId: number }>
  ): Promise<QueryResponse<EventDTO>> {
    let includes: any = [];
    let filters: any = {};
    let query: any = {};
    if (typeof data?.search === "string") {
      filters[Op.or] = [
        {
          name: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          content: {
            [Op.like]: "%" + data.search + "%",
          },
        },
      ];
    }
    if (typeof data?.CreaterId === "number") {
      filters.CreaterId = data.CreaterId;
    }
    if(data?.all === undefined){
      filters.published = true;
    }
    if (data?.EventCategoryId !== undefined) {
      filters.EventCategoryId  = data.EventCategoryId;
    }
    let sort: any = [];
    if (typeof data?.sort !== "undefined") {
      sort = data.sort.map((s) => [s.sortColumn, s.sortType]);
    } else {
      sort = [["updatedAt", "desc"]];
    }

    if (typeof data?.populate !== "undefined") {
      if (data?.populate === "*") {
        includes = [
          { model: this.Users, as: "users", attributes: PublicUserDTO },
          { model: this.EventImages, as: "eventImages" },
          { model: this.EventCategory, as: "eventCategory" }
        ];
      } else {
        if (data?.populate.includes("users")) {
          includes = [
            ...includes,
            { model: this.Users, as: "users", attributes: PublicUserDTO },
          ];
        }
        if (data?.populate.includes("eventImages")) {
          includes = [
            ...includes,
            { model: this.Like, as: "eventImages" },
          ];
        }
        if (data?.populate.includes("eventCategory")) {
          includes = [
            ...includes,
            { model: this.EventCategory, as: "eventCategory" },
          ];
        }
      }
    }

    query = {
      attributes: { 
        // include: [[Sequelize.fn("COUNT", Sequelize.col("likeEvents.id")), "likeCount"]] 
        include: [[Sequelize.literal("(SELECT COUNT(*) FROM Likes where Likes.EventId=Event.id)"), "likeCount"],
                 [Sequelize.literal("(SELECT COUNT(*) FROM Comments where Comments.EventId=Event.id)"), "commentCount"]]
      },
      where: filters,
      order: sort,
      include: includes,
      distinct: true
    }
    if(data && data.offset != null && data.limit != null){
      query.offset = data.offset;
      query.limit = data.limit;
    }
    const responses = await this.Event.findAndCountAll(query);
    return responses;
  }

  async getEventById(data?: Partial<QueryOptions & { id: number, UserId: number }>): Promise<EventDTO | undefined> {
    let includes: any = [];
    if (typeof data?.populate !== "undefined") {
      if (data?.populate === "*") {
        includes = [
          { model: this.Users, as: "users", attributes: PublicUserDTO },
          { model: this.EventImages, as: "eventImages" },
          { model: this.EventCategory, as: "eventCategory" }
        ];
      } else {
        if (data?.populate.includes("users")) {
          includes = [
            ...includes,
            { model: this.Users, as: "users", attributes: PublicUserDTO },
          ];
        }
        if (data?.populate.includes("eventImages")) {
          includes = [
            ...includes,
            { model: this.EventImages, as: "eventImages" },
          ];
        }
        if (data?.populate.includes("eventCategory")) {
          includes = [
            ...includes,
            { model: this.EventCategory, as: "eventCategory" },
          ];
        }
      }
    }
    if(data?.UserId !== undefined){
      includes = [
        ...includes,
        { model: this.Wishlist, required: false, as: "wishlistEvents", where:{ UserId: data.UserId} },
        { model: this.Like, required: false, as: "likeEvents", where:{ UserId: data.UserId} },
      ];
    }
    const record = await this.Event.findByPk(data?.id, {include: includes});
    return record;
  }

  async createEvent(
    data: EventInput & { slug: string; CreaterId: number }
  ): Promise<EventDTO | undefined> {
    const newRecord = await this.Event.create({
      ...data,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
    }, {
      include: [{
        model: this.EventImages,
        as: "eventImages",
      }]
    });
    return newRecord;
  }

  async updateEvent(
    id: number,
    data: Partial<EventInput>
  ): Promise<EventDTO | undefined> {
    let record = await this.Event.findByPk(id);
    await record.update({
      ...data,
    }, {
      include: [{
        model: this.EventImages,
        as: "eventImages",
      }]
    });
    record = await this.Event.findByPk(id, {include: [
      { model: this.EventImages, as: "eventImages" },
    ]});
    if(data.eventImages){
      for (const eventImage of data.eventImages) {
        await this.EventImages.create({
          ...eventImage,
          EventId: id,
        });
      }
    }
    return record;
  }
  async deleteEvent(id: number): Promise<boolean> {
    const detroy = await this.Event.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

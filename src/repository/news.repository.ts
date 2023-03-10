import { QueryOptions, QueryResponse } from "./../dto/typings.dto";
import NewsDTO, { NewsInput } from "../dto/news.dto";
import DBContext from "../entities";
import NewsInterface from "../interfaces/news.interface";
import { Op } from "sequelize";
import { PublicUserDTO } from "../dto/user.dto";

export default class NewsRepository implements NewsInterface {
  private News = DBContext.getConnect().news;
  private Users = DBContext.getConnect().users;
  private Wishlist = DBContext.getConnect().wishlist;
  private Like = DBContext.getConnect().like;
  private Category = DBContext.getConnect().category;

  async getNewses(
    data?: Partial<
      QueryOptions & {
        CategoryId: number;
        CreaterId: number;
        ToDate: Date;
        FromDate: Date;
        all: string;
      }
    >
  ): Promise<QueryResponse<NewsDTO>> {
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
          description: {
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
    if (typeof data?.CategoryId === "number") {
      filters.CategoryId = data.CategoryId;
    }
    if (typeof data?.CreaterId === "number") {
      filters.CreaterId = data.CreaterId;
    }
    if (data?.all === undefined) {
      filters.published = true;
    }
    let sort: any = [];
    if (typeof data?.sort !== "undefined") {
      sort = data.sort.map((s) => [s.sortColumn, s.sortType]);
    } else {
      sort = [["updatedAt", "desc"]];
    }

    if (data && data.FromDate && data.ToDate) {
      filters[Op.and] = [
        {
          createdAt: {
            [Op.gt]: data.FromDate,
          },
        },
        {
          createdAt: {
            [Op.lt]: data.ToDate,
          },
        },
      ];
    }

    if (typeof data?.populate !== "undefined") {
      if (data?.populate === "*") {
        includes = [
          { model: this.Users, as: "users", attributes: PublicUserDTO },
          { model: this.Category, as: "category" },
        ];
      } else {
        if (data?.populate.includes("users")) {
          includes = [
            ...includes,
            { model: this.Users, as: "users", attributes: PublicUserDTO },
          ];
        }
        if (data?.populate.includes("category")) {
          includes = [...includes, { model: this.Category, as: "category" }];
        }
      }
    }

    query = {
      where: filters,
      order: sort,
      include: includes,
      distinct: true,
    };
    if (data && data.offset != null && data.limit != null) {
      query.offset = data.offset;
      query.limit = data.limit;
    }
    const newses = await this.News.findAndCountAll(query);
    return newses;
  }

  async getNewsById(
    data?: Partial<QueryOptions & { id: number; UserId: number }>
  ): Promise<NewsDTO | undefined> {
    let includes: any = [];
    if (typeof data?.populate !== "undefined") {
      if (data?.populate === "*") {
        includes = [
          { model: this.Users, as: "users", attributes: PublicUserDTO },
          { model: this.Category, as: "category" },
        ];
      } else {
        if (data?.populate.includes("users")) {
          includes = [
            ...includes,
            { model: this.Users, as: "users", attributes: PublicUserDTO },
          ];
        }
        if (data?.populate.includes("category")) {
          includes = [...includes, { model: this.Category, as: "category" }];
        }
      }
    }
    if (data?.UserId !== undefined) {
      includes = [
        ...includes,
        {
          model: this.Wishlist,
          required: false,
          as: "wishlistNewses",
          where: { UserId: data.UserId },
        },
        {
          model: this.Like,
          required: false,
          as: "likeNewses",
          where: { UserId: data.UserId },
        },
      ];
    }
    const news = await this.News.findByPk(data?.id, { include: includes });
    return news;
  }

  async createNews(
    data: NewsInput & { slug: string; CreaterId: number }
  ): Promise<NewsDTO | undefined> {
    const newNews = await this.News.create({
      ...data,
      viewsCount: 0,
      sharedCount: 0,
    });
    return newNews;
  }

  async updateNews(
    id: number,
    data: Partial<NewsInput>
  ): Promise<NewsDTO | undefined> {
    const news = await this.News.findByPk(id);
    await news.update({
      ...data,
    });
    return news;
  }
  async deleteNews(id: number): Promise<boolean> {
    const detroy = await this.News.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

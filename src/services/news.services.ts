import { QueryOptions } from "./../dto/typings.dto";
import NewsDTO, { NewsInput } from "../dto/news.dto";
import UserDTO from "../dto/user.dto";
import { toSlug } from "../helpers/utils";
import NewsRepository from "../repository/news.repository";
import { Pagination, ResponseEntry } from "../typings";
import RedisContext from "../cache/redis";
import { DateEnum } from "../configs/constants";
const fs = require('fs');
const path = require('path');

export async function getNewses(
  query: any,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<NewsDTO[]>> {
  const News = new NewsRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<
      QueryOptions & { CategoryId: number; CreaterId: number; ToDate: Date; FromDate: Date }
    > = queryOptions;
    if (typeof query.CategoryId !== "undefined") {
      options.CategoryId = parseInt(query.CategoryId, 0);
    }
    if (typeof query.DateEnum !== "undefined") {
        // search createdDate 
        options.ToDate = new Date();
        if(query.DateEnum == DateEnum.DAY){
          options.FromDate = new Date(options.ToDate.getTime() - (1000 * 60 * 60 * 24))
        }
        else if(query.DateEnum == DateEnum.WEEK){
          options.FromDate = new Date(options.ToDate.getTime() - (1000 * 60 * 60 * 24 * 7))
        }
        else if(query.DateEnum == DateEnum.MONTH){
          options.FromDate = new Date(options.ToDate.getTime() - (1000 * 60 * 60 * 24 * 30))
        }
        else if(query.DateEnum == DateEnum.YEAR){
          options.FromDate = new Date(options.ToDate.getTime() - (1000 * 60 * 60 * 24 * 365))
        }
    }
    /** Query data */
    const newses = await News.getNewses(options);

    if(queryOptions.limit != null && queryOptions.offset != null){
      /** Get pagination */
      const pageSize = newses.rows.length;
      const pageCount = Math.ceil(newses.count / queryOptions.limit);
      const pagination: Pagination = {
        count: newses.count,
        page: parseInt(query.pagination.page, 10),
        pageCount,
        pageSize,
      };
      meta = {
        pagination,
      };
    }
    return {
      data: newses.rows as NewsDTO[],
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
      meta: meta,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function getNewsById(
  id: number,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<NewsDTO | null>> {
  const News = new NewsRepository();
  const redis = RedisContext.getConnect();
  try {
    let options: Partial<QueryOptions & {id: number, UserId?: number }> = queryOptions;
    options.id = id;
    const news: any = await News.getNewsById(options);
    // try {
    //   redis.setEx(`news:${id}`, 3600, JSON.stringify(news.dataValues));
    // } catch (error) {
    //   console.error(error);
    // }
    return {
      data: news as NewsDTO,
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function createNews(
  data: NewsInput,
  user: UserDTO
): Promise<ResponseEntry<NewsDTO | null>> {
  const News = new NewsRepository();
  if(data.draft === true){
    //// handle draft content
    // input default value for the fields that are empty
    data.published = false;
    if(!data.description){
      data.description = "Thông tin này chưa được điền.";
    }
    if(!data.content){
      data.content = "Thông tin này chưa được điền.";
    }
    if(!data.name){
      data.name = "Thông tin này chưa được điền.";
    }
  }
  else{
    data.published = true;
  }
  const slug = toSlug(data.name);
  try {
    const news = await News.createNews({
      ...data,
      slug: slug,
      CreaterId: user.id,
    });
    return {
      data: news as NewsDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateNews(
  id: number,
  data: NewsInput
): Promise<ResponseEntry<NewsDTO | null>> {
  const News = new NewsRepository();
  const { name, description, CategoryId, content } = data;
  if (!name || !description || !CategoryId || !content)
    return {
      data: null,
      status: {
        code: 406,
        message: "Invalid payload!",
        success: false,
      },
    };
  try {
    // remove banner
    let pathBanner = "";
    const oldnews = await News.getNewsById({id: id});
    if(data.imageBannerName){
      if(oldnews && oldnews.imageBannerName){
        pathBanner = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_NEWS, oldnews.imageBannerName);
      }
    }
    if(data.draft === true && oldnews?.draft === true){
      //// handle draft content
      // input default value for the fields that are empty
      data.published = false;
      if(!data.description){
        data.description = "Thông tin này chưa được điền.";
      }
      if(!data.content){
        data.content = "Thông tin này chưa được điền.";
      }
      if(!data.name){
        data.name = "Thông tin này chưa được điền.";
      }
    }
    else{
      if(oldnews?.draft === true){
        data.draft = false;
        data.published = true;
      }
      else{
        // delete draft field
        delete data.draft;
      }
    }


    // update news
    const news = await News.updateNews(id, data);
    // remove banner file
    if(pathBanner){
      fs.unlinkSync(pathBanner);
    }
    return {
      data: news as NewsDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateNewsFields(
  id: number,
  data: Partial<NewsInput>
): Promise<ResponseEntry<NewsDTO | null>> {
  const News = new NewsRepository();
  try {
    // remove banner
    let pathBanner = "";
    const oldnews = await News.getNewsById({id: id});
    if(data.imageBannerName){
      if(oldnews && oldnews.imageBannerName){
        pathBanner = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_NEWS, oldnews.imageBannerName);
      }
    }
    if(data.draft === true && oldnews?.draft === true){
      //// handle draft content
      // input default value for the fields that are empty
      data.published = false;
      if(!data.description){
        data.description = "Thông tin này chưa được điền.";
      }
      if(!data.content){
        data.content = "Thông tin này chưa được điền.";
      }
      if(!data.name){
        data.name = "Thông tin này chưa được điền.";
      }
    }
    else{
      if(oldnews?.draft === true){
        data.draft = false;
        data.published = true;
      }
      else{
        // delete draft field
        delete data.draft;
      }
    }

    // update news
    const news = await News.updateNews(id, data);
    // remove banner file
    if(pathBanner){
      fs.unlinkSync(pathBanner);
    }
    return {
      data: news as NewsDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function deleteNews(id: number): Promise<ResponseEntry<boolean>> {
  const News = new NewsRepository();
  try {
    const result = await News.deleteNews(id);
    if (!result)
      return {
        data: false,
        status: {
          code: 406,
          message: "Not Acceptable or Record do not exist",
          success: false,
        },
      };
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: false,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function publishedNews(
  id: number,
  published: boolean
): Promise<ResponseEntry<NewsDTO | null>> {
  const News = new NewsRepository();
  try {
    const record = await News.updateNews(id, {published: published});
    return {
      data: record as NewsDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}
export function validateImage(file: any): ResponseEntry<boolean>{
  let size = parseInt(process.env.SIZE_IMAGE || "0", 0) * 1024 * 1024;
  if(file.size > size){
    return {
      data: false,
      status: {
        code: 406,
        message: "The image size can't be larger than 10MB",
        success: false,
      }};
  }
  else{
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    }
  }
}
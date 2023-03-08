import { QueryOptions, QueryResponse } from "./../dto/typings.dto";
import { NewsInput } from "./../dto/news.dto";
import NewsDTO from "../dto/news.dto";

export default interface NewsInterface {
  getNewses(
    data?: Partial<QueryOptions & { CategoryId: number; CreaterId: number }>
  ): Promise<QueryResponse<NewsDTO>>;
  getNewsById(data?: Partial<QueryOptions & { id: number }>): Promise<NewsDTO | undefined>;
  createNews(
    data: NewsInput & { slug: string; CreaterId: number }
  ): Promise<NewsDTO | undefined>;
  updateNews(
    id: number,
    data: Partial<NewsInput>
  ): Promise<NewsDTO | undefined>;
  deleteNews(id: number): Promise<boolean>;
}

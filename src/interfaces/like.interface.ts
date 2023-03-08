import LikeDTO, { LikeInput } from "../dto/like.dto";
import { QueryOptions, QueryResponse } from "../dto/typings.dto";

export default interface LikeInterface {
  getLikes(
    data?: Partial<QueryOptions & { CreaterId: number }>
  ): Promise<QueryResponse<LikeDTO>>;
  getLikeById(data?: Partial<QueryOptions & { id: number }>): Promise<LikeDTO | undefined>;
  createLike(
    data: LikeInput & { slug: string; CreaterId: number }
  ): Promise<LikeDTO | undefined>;
  updateLike(
    id: number,
    data: Partial<LikeInput>
  ): Promise<LikeDTO | undefined>;
  deleteLike(id: number, userId: number): Promise<boolean>;
}

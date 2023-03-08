import CommentDTO, { CommentInput } from "../dto/comment.dto";
import { QueryOptions, QueryResponse } from "../dto/typings.dto";

export default interface CommentInterface {
  getComments(
    data?: Partial<QueryOptions & { CreaterId: number }>
  ): Promise<QueryResponse<CommentDTO>>;
  getCommentById(data?: Partial<QueryOptions & { id: number }>): Promise<CommentDTO | undefined>;
  createComment(
    data: CommentInput & { slug: string; CreaterId: number }
  ): Promise<CommentDTO | undefined>;
  updateComment(
    id: number,
    data: Partial<CommentInput>
  ): Promise<CommentDTO | undefined>;
  deleteComment(id: number, userId: number): Promise<boolean>;
}

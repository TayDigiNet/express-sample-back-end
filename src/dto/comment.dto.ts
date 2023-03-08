export default interface CommentDTO {
  id: number;
  UserId: number,
  EventId?: number,
  ProjectId?: number,
  NewsId?: number,
  createdAt: string,
  updatedAt: string,
  parentID?: number
}

export interface CommentInput {
  UserId: number,
  content: string,
  EventId?: number,
  ProjectId?: number,
  NewsId?: number,
  parentID?: number
}

export interface CommentUpdateInput {
  content: string
}
export default interface LikeDTO {
  id: number;
  UserId: number,
  EventId?: number,
  ProjectId?: number,
  NewsId?: number,
  createdAt: string;
  updatedAt: string;
}

export interface LikeInput {
  UserId: number,
  EventId?: number,
  ProjectId?: number,
  NewsId?: number,
}
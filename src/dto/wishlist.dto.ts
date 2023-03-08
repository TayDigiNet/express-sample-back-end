export default interface WishlistDTO {
  id: number;
  UserId: number,
  EventId?: number,
  ProjectId?: number,
  NewsId?: number,
  createdAt: string;
  updatedAt: string;
}

export interface WishlistInput {
  UserId: number,
  EventId?: number,
  ProjectId?: number,
  NewsId?: number,
}
export default interface EventCategoryDTO {
  id: number;
  name: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventCategoryInput {
  name: string;
  sort: number;
}
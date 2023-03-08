export default interface ProjectCategoryDTO {
  id: number;
  name: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCategoryInput {
  name: string;
  sort: number;
}
export default interface CategoryDTO {
  id: number;
  name: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  name: string;
  sort: number;
}
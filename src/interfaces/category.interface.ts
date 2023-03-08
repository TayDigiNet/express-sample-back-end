import CategoryDTO, {CategoryInput} from "../dto/category.dto";

export default interface CategoryInterface {
  getCategories(): Promise<CategoryDTO[]>;
  getCategoryById(id: number): Promise<CategoryDTO | undefined>;
  createCategory(data: {
    name: string;
    sort: number;
  }): Promise<CategoryDTO | null>;
  updateCategory(
    id: number,
    data: Partial<CategoryInput>
  ): Promise<CategoryDTO | undefined>;
  deleteCategory(id: number): Promise<boolean>;
}

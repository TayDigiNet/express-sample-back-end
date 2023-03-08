import CategoryDTO from "../dto/category.dto";
import DBContext from "../entities";
import { CategoryInput } from "../dto/category.dto";
import CategoryInterface from "../interfaces/category.interface";

export default class CategoryRepository implements CategoryInterface {
  private Category = DBContext.getConnect().category;

  async getCategories(): Promise<CategoryDTO[]> {
    const categories = await this.Category.findAll({
      order: [
        ["sort", "asc"]
    ]
    });
    return categories;
  }

  async getCategoryById(id: number): Promise<CategoryDTO | undefined> {
    const record = await this.Category.findByPk(id);
    return record;
  }

  async createCategory(data: {
    name: string;
    sort: number;
  }): Promise<CategoryDTO | null> {
    const newCategory = await this.Category.create({
      ...data,
    });
    return newCategory;
  }

  async updateCategory(
    id: number,
    data: Partial<CategoryInput>
  ): Promise<CategoryDTO | undefined> {
    const record = await this.Category.findByPk(id);
    await record.update({
      ...data,
    });
    return record;
  }
  async deleteCategory(id: number): Promise<boolean> {
    const detroy = await this.Category.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

import ProjectCategoryDTO, { ProjectCategoryInput } from "../dto/project_category.dto";
import DBContext from "../entities";
import ProjectCategoryInterface from "../interfaces/project_category.interface";

export default class ProjectCategoryRepository implements ProjectCategoryInterface {
  private ProjectCategory = DBContext.getConnect().projectCategory;

  async getProjectCategories(): Promise<ProjectCategoryDTO[]> {
    const categories = await this.ProjectCategory.findAll({
      order: [
        ["sort", "asc"]
    ]
    });
    return categories;
  }

  async getProjectCategoryById(id: number): Promise<ProjectCategoryDTO | undefined> {
    const record = await this.ProjectCategory.findByPk(id);
    return record;
  }

  async createProjectCategory(data: ProjectCategoryInput): Promise<ProjectCategoryDTO | null> {
    const newProjectCategory = await this.ProjectCategory.create({
      ...data,
    });
    return newProjectCategory;
  }

  async updateProjectCategory(
    id: number,
    data: Partial<ProjectCategoryInput>
  ): Promise<ProjectCategoryDTO | undefined> {
    const record = await this.ProjectCategory.findByPk(id);
    await record.update({
      ...data,
    });
    return record;
  }
  async deleteProjectCategory(id: number): Promise<boolean> {
    const detroy = await this.ProjectCategory.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

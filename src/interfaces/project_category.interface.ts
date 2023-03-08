import ProjectCategoryDTO, {ProjectCategoryInput} from "../dto/project_category.dto";

export default interface ProjectCategoryInterface {
  getProjectCategories(): Promise<ProjectCategoryDTO[]>;
  getProjectCategoryById(id: number): Promise<ProjectCategoryDTO | undefined>;
  createProjectCategory(data: {
    name: string;
    sort: number;
  }): Promise<ProjectCategoryDTO | null>;
  updateProjectCategory(
    id: number,
    data: Partial<ProjectCategoryInput>
  ): Promise<ProjectCategoryDTO | undefined>;
  deleteProjectCategory(id: number): Promise<boolean>;
}

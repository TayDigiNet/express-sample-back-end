import ProjectDTO, { ProjectInput } from "../dto/project.dto";
import { QueryOptions, QueryResponse } from "./../dto/typings.dto";

export default interface ProjectInterface {
  getProjects(
    data?: Partial<QueryOptions & { ProjectCategoryId: number; CreaterId: number }>
  ): Promise<QueryResponse<ProjectDTO>>;
  getProjectById(data?: Partial<QueryOptions & { id: number, UserId: number }>): Promise<ProjectDTO | undefined>;
  createProject(
    data: ProjectInput & { slug: string; CreaterId: number }
  ): Promise<ProjectDTO | undefined>;
  updateProject(
    id: number,
    data: Partial<ProjectInput>
  ): Promise<ProjectDTO | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

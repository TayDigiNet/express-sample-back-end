import ProjectImageDTO, {ProjectImageInput} from "../dto/project_image.dto";

export default interface ProjectImageInterface {
  getProjectImages(): Promise<ProjectImageDTO[]>;
  getProjectImageById(id: number): Promise<ProjectImageDTO | undefined>;
  createProjectImage(data: ProjectImageInput): Promise<ProjectImageDTO | null>;
  updateProjectImage(
    id: number,
    data: Partial<ProjectImageInput>
  ): Promise<ProjectImageDTO | undefined>;
  deleteProjectImage(id: number): Promise<boolean>;
}

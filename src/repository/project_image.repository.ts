import ProjectImageDTO, { ProjectImageInput } from "../dto/project_image.dto";
import DBContext from "../entities";
import ProjectImageInterface from "../interfaces/project_image.interface";

export default class ProjectImageRepository implements ProjectImageInterface {
  private ProjectImage = DBContext.getConnect().projectImage;

  async getProjectImages(): Promise<ProjectImageDTO[]> {
    const images = await this.ProjectImage.findAll();
    return images;
  }

  async getProjectImageById(id: number): Promise<ProjectImageDTO | undefined> {
    const record = await this.ProjectImage.findByPk(id);
    return record;
  }

  async createProjectImage(data: ProjectImageInput): Promise<ProjectImageDTO | null> {
    const newProjectImage = await this.ProjectImage.create({
      ...data,
    });
    return newProjectImage;
  }

  async updateProjectImage(
    id: number,
    data: Partial<ProjectImageInput>
  ): Promise<ProjectImageDTO | undefined> {
    const record = await this.ProjectImage.findByPk(id);
    await record.update({
      ...data,
    });
    return record;
  }
  async deleteProjectImage(id: number): Promise<boolean> {
    const detroy = await this.ProjectImage.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

import ProjectImageDTO from "./project_image.dto";
import { Json } from "sequelize/types/utils";

export default interface ProjectDTO {
  id: number;
  name: string;
  slug?: string;
  content: string;
  description: string;
  bannerUrl: string;
  imageUrls: string;
  videoUrls: string;
  launchDate: Date;
  plan: string;
  blocked: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  CreaterId: number;
  RepresentativeId: number;
  ProjectOperatorsIds: number[];
  ProjectCategoryId: number;
  imageAvatarName: string;
  imageAvatarPath: string;
  imageAvatarSize: string;
  imageAvatarMineType: string;
  imageAvatarOriginalName: string;
  imageAvatarDimensions: string;
  projectImages: ProjectImageDTO[]
  published: boolean;
  expiredAt: Date;
  requestApproved: boolean;
  requestUpdated: ProjectInput;
  draft?: boolean;
}

export interface ProjectInput {
  name: string;
  content: string;
  description: string;
  bannerUrl?: string;
  imageUrls?: string;
  videoUrls?: string;
  launchDate: Date;
  plan: string;
  RepresentativeId?: number;
  ProjectOperatorsIds?: string;
  ProjectCategoryId: number;
  imageAvatarName?: string;
  imageAvatarPath?: string;
  imageAvatarSize?: string;
  imageAvatarMineType?: string;
  imageAvatarOriginalName?: string;
  imageAvatarDimensions?: string;
  removedImageIds?: string;
  published?: boolean;
  expiredAt?: Date;
  requestApproved?: boolean;
  requestUpdated?: any;
  projectImages?: ProjectImageDTO[]
  removedImageNames?: string;
  draft?: boolean;
  viewsCount: number;
}

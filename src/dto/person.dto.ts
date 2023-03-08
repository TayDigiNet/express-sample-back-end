export default interface PersonDTO {
  id: number;
  name: string;
  slug?: string;
  position: string;
  phone: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  CreaterId: number;
  imageAvatarName?: string;
  imageAvatarPath?: string;
  imageAvatarSize?: string;
  imageAvatarMineType?: string;
  imageAvatarOriginalName?: string;
  imageAvatarDimensions?: string;
}

export interface PersonInput {
  name: string;
  position: string;
  phone: string;
  email: string;
  avatar: string;
  imageAvatarName?: string;
  imageAvatarPath?: string;
  imageAvatarSize?: string;
  imageAvatarMineType?: string;
  imageAvatarOriginalName?: string;
  imageAvatarDimensions?: string;
}

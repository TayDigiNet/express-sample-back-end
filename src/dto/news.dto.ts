export default interface NewsDTO {
  id: number;
  name: string;
  description: string;
  bannerUrl?: string;
  slug?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  CategoryId: number;
  CreaterId: number;
  published: boolean;
  imageBannerName?: string;
  imageBannerPath?: string;
  imageBannerSize?: string;
  imageBannerMineType?: string;
  imageBannerOriginalName?: string;
  imageBannerDimensions?: string;
  draft?: boolean;
}

export interface NewsInput {
  name: string;
  description: string;
  bannerUrl?: string;
  content: string;
  CategoryId: number;
  published?: boolean;
  imageBannerName?: string;
  imageBannerPath?: string;
  imageBannerSize?: string;
  imageBannerMineType?: string;
  imageBannerOriginalName?: string;
  imageBannerDimensions?: string;
  draft?: boolean;
}

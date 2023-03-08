import EventImageDTO from "./event_image.dto";

export default interface EventDTO {
  id: number;
  name: string;
  bannerUrl?: string;
  imageUrls?: string;
  startedDateAt: string;
  endedDateAt: string;
  price?: number;
  location: string;
  content: string;
  slug?: string;
  viewsCount?: number;
  playVideoCount?: number;
  createdAt: string;
  updatedAt: string;
  CreaterId: number;
  published: boolean;
  eventImages: EventImageDTO[]
  draft?: boolean;
}

export interface EventInput {
  name: string;
  bannerUrl?: string;
  imageUrls?: string;
  startedDateAt: Date;
  endedDateAt: Date;
  price: number;
  location: string;
  content: string;
  published: boolean;
  removedImageIds?: string;
  eventImages?: EventImageDTO[]
  draft?: boolean;
  viewsCount?: number;
  playVideoCount?: number;
}
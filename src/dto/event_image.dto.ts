export default interface EventImageDTO {
  id: number;
  imageName: string;
  imagePath: string;
  imageSize: string;
  imageMineType: string;
  imageOriginalName: string;
  imageDimensions: string;
}

export interface EventImageInput {
  // EventId: number;
  imageName: string;
  imagePath: string;
  imageSize: string;
  imageMineType: string;
  imageOriginalName: string;
  imageDimensions: string;
}
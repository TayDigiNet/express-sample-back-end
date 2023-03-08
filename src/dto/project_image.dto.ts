export default interface ProjectImageDTO {
  id: number;
  imageName: string;
  imagePath: string;
  imageSize: string;
  imageMineType: string;
  imageOriginalName: string;
  imageDimensions: string;
}

export interface ProjectImageInput {
  // ProjectId: number;
  imageName: string;
  imagePath: string;
  imageSize: string;
  imageMineType: string;
  imageOriginalName: string;
  imageDimensions: string;
}
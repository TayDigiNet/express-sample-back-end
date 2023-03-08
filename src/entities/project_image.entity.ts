import { Sequelize, Model, DataTypes } from "sequelize";

export default interface ProjectImageEntity {
  id: number;
  imageName: string;
  imagePath: string;
  imageSize: string;
  imageMineType: string;
  imageOriginalName: string;
  imageDimensions: string;
}

export function ProjectImage(sequelize: any) {
  const ProjectImage = sequelize.define("ProjectImage", {
    imageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageSize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageMineType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageOriginalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageDimensions: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  return ProjectImage;
}

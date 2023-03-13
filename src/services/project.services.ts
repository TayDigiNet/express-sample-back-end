import { QueryOptions } from "./../dto/typings.dto";
import UserDTO from "../dto/user.dto";
import { toSlug } from "../helpers/utils";
import { Pagination, ResponseEntry } from "../typings";
import RedisContext from "../cache/redis";
import ProjectDTO, { ProjectInput } from "../dto/project.dto";
import ProjectRepository from "../repository/project.repository";
import ProjectImageRepository from "../repository/project_image.repository";
const fs = require("fs");
const path = require("path");
import { ROLE, DateEnum } from "../configs/constants";

export async function getProjects(
  query: any,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<ProjectDTO[]>> {
  const Project = new ProjectRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<
      QueryOptions & {
        ProjectCategoryId: number;
        CreaterId: number;
        ToDate: Date;
        FromDate: Date;
      }
    > = queryOptions;
    if (typeof query.ProjectCategoryId !== "undefined") {
      options.ProjectCategoryId = parseInt(query.ProjectCategoryId, 0);
    }
    if (typeof query.DateEnum !== "undefined") {
      // search createdDate
      options.ToDate = new Date();
      if (query.DateEnum == DateEnum.DAY) {
        options.FromDate = new Date(
          options.ToDate.getTime() - 1000 * 60 * 60 * 24
        );
      } else if (query.DateEnum == DateEnum.WEEK) {
        options.FromDate = new Date(
          options.ToDate.getTime() - 1000 * 60 * 60 * 24 * 7
        );
      } else if (query.DateEnum == DateEnum.MONTH) {
        options.FromDate = new Date(
          options.ToDate.getTime() - 1000 * 60 * 60 * 24 * 30
        );
      } else if (query.DateEnum == DateEnum.YEAR) {
        options.FromDate = new Date(
          options.ToDate.getTime() - 1000 * 60 * 60 * 24 * 365
        );
      }
    }
    /** Query data */
    const records = await Project.getProjects(options);

    if (queryOptions.limit != null && queryOptions.offset != null) {
      /** Get pagination */
      const pageSize = records.rows.length;
      const pageCount = Math.ceil(records.count / queryOptions.limit);
      const pagination: Pagination = {
        count: records.count,
        page: parseInt(query.pagination.page, 10),
        pageCount,
        pageSize,
      };
      meta = {
        pagination,
      };
    }
    return {
      data: records.rows as ProjectDTO[],
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
      meta: meta,
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function getProjectById(
  id: number,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<ProjectDTO | null>> {
  const Project = new ProjectRepository();
  try {
    let options: Partial<QueryOptions & { id: number; UserId?: number }> =
      queryOptions;
    options.id = id;
    const record: any = await Project.getProjectById(options);
    if (record) {
      Project.updateProject(record.id, { viewsCount: record.viewsCount + 1 });
    }
    return {
      data: record as ProjectDTO,
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 404,
        message: "Not Found Record!",
        success: false,
      },
    };
  }
}

export async function createProject(
  data: ProjectInput,
  user: UserDTO
): Promise<ResponseEntry<ProjectDTO | null>> {
  const Project = new ProjectRepository();
  try {
    let published = true;
    let requestApproved = false;
    if (user.role.name === ROLE.USER) {
      published = false;
      requestApproved = true;
    }
    if (data.draft === true) {
      //// handle draft content
      // input default value for the fields that are empty
      if (!data.description) {
        data.description = "Thông tin này chưa được điền.";
      }
      if (!data.content) {
        data.content = "Thông tin này chưa được điền.";
      }
      if (!data.name) {
        data.name = "Thông tin này chưa được điền.";
      }
      if (!data.plan) {
        data.plan = "Thông tin này chưa được điền.";
      }
      if (!data.launchDate) {
        data.launchDate = new Date();
      }
      if (!data.expiredAt) {
        data.expiredAt = new Date(
          data.launchDate.setDate(data.launchDate.getDate() + 10)
        );
      }
      requestApproved = false;
    }
    const slug = toSlug(data.name);
    const record = await Project.createProject({
      ...data,
      slug: slug,
      CreaterId: user.id,
      published: published,
      requestApproved: requestApproved,
    });
    return {
      data: record as ProjectDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateProject(
  id: number,
  data: ProjectInput & { UserId?: number },
  user: UserDTO
): Promise<ResponseEntry<ProjectDTO | null>> {
  const Project = new ProjectRepository();
  const ProjectImage = new ProjectImageRepository();
  const { name, content, description, launchDate, plan, ProjectCategoryId } =
    data;
  if (
    !name ||
    !content ||
    !description ||
    !launchDate ||
    !plan ||
    !ProjectCategoryId
  )
    return {
      data: null,
      status: {
        code: 406,
        message: "Invalid payload!",
        success: false,
      },
    };
  try {
    const project = await Project.getProjectById({ id: id });
    let record = null;

    if (user.role.name === ROLE.USER) {
      data.UserId = user.id;
    }
    if (!project?.published || user.role.name === ROLE.ADMIN) {
      if (data.draft === true && project?.draft === true) {
        //// handle draft content
        // input default value for the fields that are empty
        if (!data.description) {
          data.description = "Thông tin này chưa được điền.";
        }
        if (!data.content) {
          data.content = "Thông tin này chưa được điền.";
        }
        if (!data.name) {
          data.name = "Thông tin này chưa được điền.";
        }
        if (!data.plan) {
          data.plan = "Thông tin này chưa được điền.";
        }
        if (!data.launchDate) {
          data.launchDate = new Date(data.launchDate);
        }
        if (!data.expiredAt) {
          data.launchDate = new Date(data.launchDate);
          data.expiredAt = new Date(
            data.launchDate.setDate(data.launchDate.getDate() + 10)
          );
        }
      } else {
        if (project?.draft === true) {
          data.requestApproved = true;
          data.draft = false;
        } else {
          delete data.draft;
        }
      }

      // remove avatar
      let pathAvatar = "";
      if (data.imageAvatarName) {
        if (project && project.imageAvatarName) {
          pathAvatar = path.join(
            process.env.ROOT_FOLDER,
            process.env.UPLOAD_PATH,
            process.env.FOLDER_PROJECT,
            project.imageAvatarName
          );
        }
      }
      // update project
      record = await Project.updateProject(id, data);
      // remove images
      if (data.removedImageIds) {
        let removedImageIds = JSON.parse(data.removedImageIds || "");
        for (const imageId of removedImageIds as number[]) {
          const projectImage = await ProjectImage.getProjectImageById(imageId);
          if (projectImage) {
            await ProjectImage.deleteProjectImage(imageId);
            try {
              fs.unlinkSync(
                path.join(
                  process.env.ROOT_FOLDER,
                  process.env.UPLOAD_PATH,
                  process.env.FOLDER_PROJECT,
                  projectImage.imageName
                )
              );
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
      if (pathAvatar) {
        try {
          fs.unlinkSync(pathAvatar);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      // handle draft project
      if (project.requestUpdated && project.requestUpdated.projectImages) {
        if (!data.removedImageNames) {
          data.removedImageNames = "";
        }
        let projectImages = project.requestUpdated.projectImages.filter(
          (obj) => !data.removedImageNames?.includes(obj.imageName)
        );
        data.projectImages = [...projectImages, ...(data.projectImages || [])];
      }
      record = await Project.updateProject(id, {
        requestUpdated: data,
        requestApproved: true,
      });
      if (project.requestUpdated) {
        let projectTemp = project.requestUpdated as ProjectInput;
        let pathAvatar = "";
        // remove avatar
        if (data.imageAvatarName) {
          if (projectTemp.imageAvatarName) {
            pathAvatar = path.join(
              process.env.ROOT_FOLDER,
              process.env.UPLOAD_PATH,
              process.env.FOLDER_PROJECT,
              projectTemp.imageAvatarName
            );
            try {
              fs.unlinkSync(pathAvatar);
            } catch (error) {
              console.error(error);
            }
          }
        }
        // remove images
        if (data.removedImageNames) {
          let removedImageNames = data.removedImageNames.split(",");
          for (const imageName of removedImageNames as string[]) {
            try {
              fs.unlinkSync(
                path.join(
                  process.env.ROOT_FOLDER,
                  process.env.UPLOAD_PATH,
                  process.env.FOLDER_PROJECT,
                  imageName
                )
              );
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    }

    return {
      data: record as ProjectDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function updateProjectFields(
  id: number,
  data: Partial<ProjectInput> & { UserId?: number },
  user: UserDTO
): Promise<ResponseEntry<ProjectDTO | null>> {
  const Project = new ProjectRepository();
  const ProjectImage = new ProjectImageRepository();
  try {
    // remove avatar
    let pathAvatar = "";
    const project = await Project.getProjectById({ id: id });
    let record = null;

    if (user.role.name === ROLE.USER) {
      data.UserId = user.id;
    }
    if (!project?.published || user.role.name === ROLE.ADMIN) {
      if (data.draft === true && project?.draft === true) {
        //// handle draft content
        // input default value for the fields that are empty
        if (!data.description) {
          data.description = "Thông tin này chưa được điền.";
        }
        if (!data.content) {
          data.content = "Thông tin này chưa được điền.";
        }
        if (!data.name) {
          data.name = "Thông tin này chưa được điền.";
        }
        if (!data.plan) {
          data.plan = "Thông tin này chưa được điền.";
        }
        if (!data.launchDate) {
          data.launchDate = new Date();
        }
        if (!data.expiredAt) {
          data.expiredAt = new Date(
            data.launchDate.setDate(data.launchDate.getDate() + 10)
          );
        }
      } else {
        if (project?.draft === true) {
          data.requestApproved = true;
          data.draft = false;
        } else {
          delete data.draft;
        }
      }

      if (data.imageAvatarName) {
        if (project && project.imageAvatarName) {
          pathAvatar = path.join(
            process.env.ROOT_FOLDER,
            process.env.UPLOAD_PATH,
            process.env.FOLDER_PROJECT,
            project.imageAvatarName
          );
        }
      }
      // update project
      record = await Project.updateProject(id, data);
      // remove images
      if (data.removedImageIds) {
        let removedImageIds = JSON.parse(data.removedImageIds || "");
        for (const imageId of removedImageIds as number[]) {
          const projectImage = await ProjectImage.getProjectImageById(imageId);
          if (projectImage) {
            await ProjectImage.deleteProjectImage(imageId);
            try {
              fs.unlinkSync(
                path.join(
                  process.env.ROOT_FOLDER,
                  process.env.UPLOAD_PATH,
                  process.env.FOLDER_PROJECT,
                  projectImage.imageName
                )
              );
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
      if (pathAvatar) {
        try {
          fs.unlinkSync(pathAvatar);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      // handle draft project
      if (project.requestUpdated && project.requestUpdated.projectImages) {
        if (!data.removedImageNames) {
          data.removedImageNames = "";
        }
        let projectImages = project.requestUpdated.projectImages.filter(
          (obj) => !data.removedImageNames?.includes(obj.imageName)
        );
        console.log(projectImages);
        data.projectImages = [...projectImages, ...(data.projectImages || [])];
      }
      record = await Project.updateProject(id, {
        requestUpdated: data,
        requestApproved: true,
      });
      if (project.requestUpdated) {
        let projectTemp = project.requestUpdated as ProjectInput;
        let pathAvatar = "";
        // remove avatar
        if (data.imageAvatarName) {
          if (projectTemp.imageAvatarName) {
            pathAvatar = path.join(
              process.env.ROOT_FOLDER,
              process.env.UPLOAD_PATH,
              process.env.FOLDER_PROJECT,
              projectTemp.imageAvatarName
            );
            try {
              fs.unlinkSync(pathAvatar);
            } catch (error) {
              console.error(error);
            }
          }
        }
        // remove images
        if (data.removedImageNames) {
          let removedImageNames = data.removedImageNames.split(",");
          for (const imageName of removedImageNames as string[]) {
            try {
              fs.unlinkSync(
                path.join(
                  process.env.ROOT_FOLDER,
                  process.env.UPLOAD_PATH,
                  process.env.FOLDER_PROJECT,
                  imageName
                )
              );
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    }

    return {
      data: record as ProjectDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function deleteProject(
  id: number
): Promise<ResponseEntry<boolean>> {
  const Project = new ProjectRepository();
  try {
    const result = await Project.deleteProject(id);
    if (!result)
      return {
        data: false,
        status: {
          code: 406,
          message: "Not Acceptable or Record do not exist",
          success: false,
        },
      };
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: false,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export function validateImage(file: any): ResponseEntry<boolean> {
  let size = parseInt(process.env.SIZE_IMAGE || "0", 0) * 1024 * 1024;
  if (file.size > size) {
    return {
      data: false,
      status: {
        code: 406,
        message: "The image size can't be larger than 10MB",
        success: false,
      },
    };
  } else {
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  }
}

export async function approveProject(
  id: number,
  data: Partial<ProjectInput> & { UserId?: number },
  user: UserDTO
): Promise<ResponseEntry<ProjectDTO | null>> {
  const Project = new ProjectRepository();
  try {
    let record = null;
    let pathAvatar = "";
    let project: any = await Project.getProjectById({ id: id });
    const ProjectImage = new ProjectImageRepository();
    if (data.published && project.requestUpdated) {
      data = project.requestUpdated;
      data.published = true;
      // remove avatar
      if (project.requestUpdated.imageAvatarName) {
        if (project.imageAvatarName) {
          pathAvatar = path.join(
            process.env.ROOT_FOLDER,
            process.env.UPLOAD_PATH,
            process.env.FOLDER_PROJECT,
            project.imageAvatarName
          );
          try {
            fs.unlinkSync(pathAvatar);
          } catch (error) {
            console.error(error);
          }
        }
      }
      // remove images
      if (project.requestUpdated.removedImageIds) {
        let removedImageIds = JSON.parse(
          project.requestUpdated.removedImageIds || ""
        );
        for (const imageId of removedImageIds as number[]) {
          const projectImage = await ProjectImage.getProjectImageById(imageId);
          if (projectImage) {
            await ProjectImage.deleteProjectImage(imageId);
            try {
              fs.unlinkSync(
                path.join(
                  process.env.ROOT_FOLDER,
                  process.env.UPLOAD_PATH,
                  process.env.FOLDER_PROJECT,
                  projectImage.imageName
                )
              );
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
      data.requestUpdated = null;
      delete data.ProjectCategoryId;
    }

    data.requestApproved = false;

    record = await Project.updateProject(id, data);

    return {
      data: record as ProjectDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function requestApproveProject(
  id: number,
  data: Partial<ProjectInput> & { UserId?: number },
  user: UserDTO
): Promise<ResponseEntry<ProjectDTO | null>> {
  const Project = new ProjectRepository();
  try {
    let record = null;
    if (user.role.name === ROLE.USER) {
      data.UserId = user.id;
    }
    record = await Project.updateProject(id, data);

    return {
      data: record as ProjectDTO,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

export async function sharedCount(id: number) {
  const Project = new ProjectRepository();
  try {
    const project = await Project.getProjectById({ id: id });
    if (project) {
      Project.updateProject(project.id, { shareCount: project.shareCount + 1 });
    }
    return {
      data: true,
      status: {
        code: 201,
        message: "Successfull!",
        success: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      status: {
        code: 406,
        message: "Not Acceptable!",
        success: false,
      },
    };
  }
}

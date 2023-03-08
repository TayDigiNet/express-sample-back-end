import ProjectCategoryDTO, {ProjectCategoryInput} from "../dto/project_category.dto";
import ProjectCategoryRepository from "../repository/project_category.repository";
import { ResponseEntry } from "../typings";

export async function getProjectCategories(): Promise<ResponseEntry<ProjectCategoryDTO[]>> {
  const ProjectCategory = new ProjectCategoryRepository();
  try {
    const projectCategory = await ProjectCategory.getProjectCategories();
    return {
      data: projectCategory as ProjectCategoryDTO[],
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
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

export async function getProjectCategoryById(
  id: number
): Promise<ResponseEntry<ProjectCategoryDTO | null>> {
  const ProjectCategory = new ProjectCategoryRepository();
  try {
    const record: any = await ProjectCategory.getProjectCategoryById(id);
    return {
      data: record as ProjectCategoryDTO,
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

export async function createProjectCategory(data: {
  name: string;
  sort: number;
}): Promise<ResponseEntry<ProjectCategoryDTO | null>> {
  const ProjectCategory = new ProjectCategoryRepository();
  try {
    const projectCategory = await ProjectCategory.createProjectCategory(data);
    return {
      data: projectCategory as ProjectCategoryDTO,
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

export async function updateProjectCategory(
  id: number,
  data: ProjectCategoryInput
): Promise<ResponseEntry<ProjectCategoryDTO | null>> {
  const ProjectCategory = new ProjectCategoryRepository();
  const {
    name,
    sort,
  } = data;
  if (
    !name ||
    !sort
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
    const record = await ProjectCategory.updateProjectCategory(id, data);
    return {
      data: record as ProjectCategoryDTO,
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

export async function deleteProjectCategory(id: number): Promise<ResponseEntry<boolean>> {
  const ProjectCategory = new ProjectCategoryRepository();
  try {
    const result = await ProjectCategory.deleteProjectCategory(id);
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
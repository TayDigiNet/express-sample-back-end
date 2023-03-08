import CategoryDTO, {CategoryInput} from "../dto/category.dto";
import CategoryRepository from "../repository/category.repository";
import { ResponseEntry } from "../typings";

export async function getCategories(): Promise<ResponseEntry<CategoryDTO[]>> {
  const Category = new CategoryRepository();
  try {
    const category = await Category.getCategories();
    return {
      data: category as CategoryDTO[],
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

export async function getCategoryById(
  id: number
): Promise<ResponseEntry<CategoryDTO | null>> {
  const Category = new CategoryRepository();
  try {
    const record: any = await Category.getCategoryById(id);
    return {
      data: record as CategoryDTO,
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

export async function createCategory(data: {
  name: string;
  sort: number;
}): Promise<ResponseEntry<CategoryDTO | null>> {
  const Category = new CategoryRepository();
  try {
    const category = await Category.createCategory(data);
    return {
      data: category as CategoryDTO,
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

export async function updateCategory(
  id: number,
  data: CategoryInput
): Promise<ResponseEntry<CategoryDTO | null>> {
  const Category = new CategoryRepository();
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
    const record = await Category.updateCategory(id, data);
    return {
      data: record as CategoryDTO,
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

export async function deleteCategory(id: number): Promise<ResponseEntry<boolean>> {
  const Category = new CategoryRepository();
  try {
    const result = await Category.deleteCategory(id);
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
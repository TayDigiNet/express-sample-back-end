import EventCategoryDTO, {EventCategoryInput} from "../dto/event_category.dto";
import EventCategoryRepository from "../repository/event_category.repository";
import { ResponseEntry } from "../typings";

export async function getEventCategories(): Promise<ResponseEntry<EventCategoryDTO[]>> {
  const EventCategory = new EventCategoryRepository();
  try {
    const eventCategory = await EventCategory.getEventCategories();
    return {
      data: eventCategory as EventCategoryDTO[],
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

export async function getEventCategoryById(
  id: number
): Promise<ResponseEntry<EventCategoryDTO | null>> {
  const EventCategory = new EventCategoryRepository();
  try {
    const record: any = await EventCategory.getEventCategoryById(id);
    return {
      data: record as EventCategoryDTO,
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

export async function createEventCategory(data: {
  name: string;
  sort: number;
}): Promise<ResponseEntry<EventCategoryDTO | null>> {
  const EventCategory = new EventCategoryRepository();
  try {
    const eventCategory = await EventCategory.createEventCategory(data);
    return {
      data: eventCategory as EventCategoryDTO,
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

export async function updateEventCategory(
  id: number,
  data: EventCategoryInput
): Promise<ResponseEntry<EventCategoryDTO | null>> {
  const EventCategory = new EventCategoryRepository();
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
    const record = await EventCategory.updateEventCategory(id, data);
    return {
      data: record as EventCategoryDTO,
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

export async function deleteEventCategory(id: number): Promise<ResponseEntry<boolean>> {
  const EventCategory = new EventCategoryRepository();
  try {
    const result = await EventCategory.deleteEventCategory(id);
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
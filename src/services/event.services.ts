import { QueryOptions } from "./../dto/typings.dto";
import UserDTO from "../dto/user.dto";
import { toSlug } from "../helpers/utils";
import { Pagination, ResponseEntry } from "../typings";
import RedisContext from "../cache/redis";
import EventDTO, { EventInput } from "../dto/event.dto";
import EventRepository from "../repository/event.repository";
import EventImageRepository from "../repository/event_image.repository";
const fs = require("fs");
const path = require("path");

export async function getEvents(
  query: any,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<EventDTO[]>> {
  const Event = new EventRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<QueryOptions & { CreaterId: number }> = queryOptions;
    /** Query data */
    const records = await Event.getEvents(options);
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
      data: records.rows as EventDTO[],
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

export async function getEventById(
  id: number,
  queryOptions: Partial<QueryOptions> & { CreaterId?: number }
): Promise<ResponseEntry<EventDTO | null>> {
  const Event = new EventRepository();
  const redis = RedisContext.getConnect();
  try {
    /** Build query options */
    let options: Partial<QueryOptions & { id: number; UserId?: number }> =
      queryOptions;
    options.id = id;
    const record: any = await Event.getEventById(options);
    if (record) {
      await Event.updateEvent(record.id, {
        viewsCount: record.viewsCount + 1,
        playVideoCount: record.playVideoCount + 1,
      });
    }
    // try {
    //   redis.setEx(`event:${id}`, 3600, JSON.stringify(record.dataValues));
    // } catch (error) {
    //   console.error(error);
    // }
    if (record) {
      Event.updateEvent(record.id, { viewsCount: record.viewsCount + 1 });
    }
    return {
      data: record as EventDTO,
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

export async function createEvent(
  data: EventInput,
  user: UserDTO
): Promise<ResponseEntry<EventDTO | null>> {
  const Event = new EventRepository();
  try {
    if (data.draft === true) {
      //// handle draft content
      // input default value for the fields that are empty
      data.published = false;
      if (!data.startedDateAt) {
        data.startedDateAt = new Date();
      }
      if (!data.endedDateAt) {
        data.endedDateAt = new Date(
          data.startedDateAt.setDate(data.startedDateAt.getDate() + 10)
        );
      }
      if (!data.location) {
        data.location = "Thông tin này chưa được điền.";
      }
      if (!data.content) {
        data.content = "Thông tin này chưa được điền.";
      }
      if (!data.name) {
        data.name = "Thông tin này chưa được điền.";
      }
    } else {
      data.published = true;
    }
    const slug = toSlug(data.name);
    const record = await Event.createEvent({
      ...data,
      slug: slug,
      CreaterId: user.id,
    });
    return {
      data: record as EventDTO,
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

export async function updateEvent(
  id: number,
  data: EventInput
): Promise<ResponseEntry<EventDTO | null>> {
  const EventImage = new EventImageRepository();
  const Event = new EventRepository();
  try {
    let event = await Event.getEventById({ id: id });
    if (data.draft === true && event?.draft === true) {
      //// handle draft content
      // input default value for the fields that are empty
      data.published = false;
      if (!data.startedDateAt) {
        data.startedDateAt = new Date();
      }
      if (!data.endedDateAt) {
        data.endedDateAt = new Date(
          data.startedDateAt.setDate(data.startedDateAt.getDate() + 10)
        );
      }
      if (!data.location) {
        data.location = "Thông tin này chưa được điền.";
      }
      if (!data.content) {
        data.content = "Thông tin này chưa được điền.";
      }
      if (!data.name) {
        data.name = "Thông tin này chưa được điền.";
      }
    } else {
      if (event?.draft === true) {
        data.draft = false;
        data.published = true;
      } else {
        // delete draft field
        delete data.draft;
      }
    }

    const record = await Event.updateEvent(id, data);
    // remove images
    if (data.removedImageIds) {
      let removedImageIds = JSON.parse(data.removedImageIds || "");
      for (const imageId of removedImageIds as number[]) {
        const eventImage = await EventImage.getEventImageById(imageId);
        if (eventImage) {
          await EventImage.deleteEventImage(imageId);
          fs.unlinkSync(
            path.join(
              process.env.ROOT_FOLDER,
              process.env.UPLOAD_PATH,
              process.env.FOLDER_EVENT,
              eventImage.imageName
            )
          );
        }
      }
    }
    return {
      data: record as EventDTO,
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

export async function updateEventFields(
  id: number,
  data: Partial<EventInput>
): Promise<ResponseEntry<EventDTO | null>> {
  const EventImage = new EventImageRepository();
  const Event = new EventRepository();
  try {
    let event = await Event.getEventById({ id: id });
    if (data.draft === true && event?.draft === true) {
      //// handle draft content
      // input default value for the fields that are empty
      data.published = false;
      if (!data.startedDateAt) {
        data.startedDateAt = new Date();
      }
      if (!data.endedDateAt) {
        data.endedDateAt = new Date(
          data.startedDateAt.setDate(data.startedDateAt.getDate() + 10)
        );
      }
      if (!data.location) {
        data.location = "Thông tin này chưa được điền.";
      }
      if (!data.content) {
        data.content = "Thông tin này chưa được điền.";
      }
      if (!data.name) {
        data.name = "Thông tin này chưa được điền.";
      }
    } else {
      if (event?.draft === true) {
        data.draft = false;
        data.published = true;
      } else {
        // delete draft field
        delete data.draft;
      }
    }

    const record = await Event.updateEvent(id, data);
    // remove images
    if (data.removedImageIds) {
      let removedImageIds = JSON.parse(data.removedImageIds || "");
      for (const imageId of removedImageIds as number[]) {
        const eventImage = await EventImage.getEventImageById(imageId);
        if (eventImage) {
          await EventImage.deleteEventImage(imageId);
          fs.unlinkSync(
            path.join(
              process.env.ROOT_FOLDER,
              process.env.UPLOAD_PATH,
              process.env.FOLDER_EVENT,
              eventImage.imageName
            )
          );
        }
      }
    }
    return {
      data: record as EventDTO,
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

export async function deleteEvent(id: number): Promise<ResponseEntry<boolean>> {
  const Event = new EventRepository();
  try {
    const result = await Event.deleteEvent(id);
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

export async function publishedEvent(
  id: number,
  published: boolean
): Promise<ResponseEntry<EventDTO | null>> {
  const Event = new EventRepository();
  try {
    const record = await Event.updateEvent(id, { published: published });
    return {
      data: record as EventDTO,
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

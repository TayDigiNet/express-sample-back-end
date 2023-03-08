import EventCategoryDTO, { EventCategoryInput } from "../dto/event_category.dto";
import DBContext from "../entities";
import EventCategoryInterface from "../interfaces/event_category.interface";

export default class EventCategoryRepository implements EventCategoryInterface {
  private EventCategory = DBContext.getConnect().eventCategory;

  async getEventCategories(): Promise<EventCategoryDTO[]> {
    const categories = await this.EventCategory.findAll({
      order: [
        ["sort", "asc"]
    ]
    });
    return categories;
  }

  async getEventCategoryById(id: number): Promise<EventCategoryDTO | undefined> {
    const record = await this.EventCategory.findByPk(id);
    return record;
  }

  async createEventCategory(data: EventCategoryInput): Promise<EventCategoryDTO | null> {
    const newEventCategory = await this.EventCategory.create({
      ...data,
    });
    return newEventCategory;
  }

  async updateEventCategory(
    id: number,
    data: Partial<EventCategoryInput>
  ): Promise<EventCategoryDTO | undefined> {
    const record = await this.EventCategory.findByPk(id);
    await record.update({
      ...data,
    });
    return record;
  }
  async deleteEventCategory(id: number): Promise<boolean> {
    const detroy = await this.EventCategory.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

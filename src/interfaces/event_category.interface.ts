import EventCategoryDTO, {EventCategoryInput} from "../dto/event_category.dto";

export default interface EventCategoryInterface {
  getEventCategories(): Promise<EventCategoryDTO[]>;
  getEventCategoryById(id: number): Promise<EventCategoryDTO | undefined>;
  createEventCategory(data: {
    name: string;
    sort: number;
  }): Promise<EventCategoryDTO | null>;
  updateEventCategory(
    id: number,
    data: Partial<EventCategoryInput>
  ): Promise<EventCategoryDTO | undefined>;
  deleteEventCategory(id: number): Promise<boolean>;
}

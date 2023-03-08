import EventDTO, { EventInput } from "../dto/event.dto";
import { QueryOptions, QueryResponse } from "./../dto/typings.dto";

export default interface EventInterface {
  getEvents(
    data?: Partial<QueryOptions & { CreaterId: number }>
  ): Promise<QueryResponse<EventDTO>>;
  getEventById(data?: Partial<QueryOptions & { id: number }>): Promise<EventDTO | undefined>;
  createEvent(
    data: EventInput & { slug: string; CreaterId: number }
  ): Promise<EventDTO | undefined>;
  updateEvent(
    id: number,
    data: Partial<EventInput>
  ): Promise<EventDTO | undefined>;
  deleteEvent(id: number): Promise<boolean>;
}

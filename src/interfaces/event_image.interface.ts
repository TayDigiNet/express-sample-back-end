import EventImageDTO, {EventImageInput} from "../dto/event_image.dto";

export default interface EventImageInterface {
  getEventImages(): Promise<EventImageDTO[]>;
  getEventImageById(id: number): Promise<EventImageDTO | undefined>;
  createEventImage(data: EventImageInput): Promise<EventImageDTO | null>;
  updateEventImage(
    id: number,
    data: Partial<EventImageInput>
  ): Promise<EventImageDTO | undefined>;
  deleteEventImage(id: number): Promise<boolean>;
}

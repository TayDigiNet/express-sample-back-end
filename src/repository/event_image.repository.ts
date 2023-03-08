import EventImageDTO, { EventImageInput } from "../dto/event_image.dto";
import DBContext from "../entities";
import EventImageInterface from "../interfaces/event_image.interface";

export default class EventImageRepository implements EventImageInterface {
  private EventImage = DBContext.getConnect().eventImage;

  async getEventImages(): Promise<EventImageDTO[]> {
    const images = await this.EventImage.findAll();
    return images;
  }

  async getEventImageById(id: number): Promise<EventImageDTO | undefined> {
    const record = await this.EventImage.findByPk(id);
    return record;
  }

  async createEventImage(data: EventImageInput): Promise<EventImageDTO | null> {
    const newEventImage = await this.EventImage.create({
      ...data,
    });
    return newEventImage;
  }

  async updateEventImage(
    id: number,
    data: Partial<EventImageInput>
  ): Promise<EventImageDTO | undefined> {
    const record = await this.EventImage.findByPk(id);
    await record.update({
      ...data,
    });
    return record;
  }
  async deleteEventImage(id: number): Promise<boolean> {
    const detroy = await this.EventImage.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

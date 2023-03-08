import ContactDTO, { ContactInput } from "../dto/contact.dto";
import { QueryOptions, QueryResponse } from "../dto/typings.dto";

export default interface ContactInterface {
  getContacts(
    data?: Partial<QueryOptions & { CreaterId: number }>
  ): Promise<QueryResponse<ContactDTO>>;
  getContactById(data?: Partial<QueryOptions & { id: number }>): Promise<ContactDTO | undefined>;
  createContact(
    data: ContactInput & { slug: string; CreaterId: number }
  ): Promise<ContactDTO | undefined>;
  updateContact(
    id: number,
    data: Partial<ContactInput>
  ): Promise<ContactDTO | undefined>;
  deleteContact(id: number, userId: number): Promise<boolean>;
}

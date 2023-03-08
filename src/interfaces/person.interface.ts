import PersonDTO, { PersonInput } from "../dto/person.dto";
import { QueryOptions, QueryResponse } from "./../dto/typings.dto";

export default interface PersonInterface {
  getPeople(
    data?: Partial<QueryOptions & { CreaterId: number }>
  ): Promise<QueryResponse<PersonDTO>>;
  getPersonById(id: number): Promise<PersonDTO | undefined>;
  createPerson(
    data: PersonInput & { slug: string; CreaterId: number }
  ): Promise<PersonDTO | undefined>;
  updatePerson(
    id: number,
    data: Partial<PersonInput>
  ): Promise<PersonDTO | undefined>;
  deletePerson(id: number): Promise<boolean>;
}

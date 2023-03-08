import { QueryOptions } from "./../dto/typings.dto";
import UserDTO from "../dto/user.dto";
import { toSlug } from "../helpers/utils";
import { Pagination, ResponseEntry } from "../typings";
import RedisContext from "../cache/redis";
import PersonDTO, { PersonInput } from "../dto/person.dto";
import PersonRepository from "../repository/person.repository";
const fs = require('fs');
const path = require('path');

export async function getPeople(
  query: any,
  queryOptions: Partial<QueryOptions>
): Promise<ResponseEntry<PersonDTO[]>> {
  const Person = new PersonRepository();
  try {
    let meta = {};
    /** Build query options */
    let options: Partial<QueryOptions & { CreaterId: number }> = queryOptions;
    /** Query data */
    const records = await Person.getPeople(options);

    if(queryOptions.limit != null && queryOptions.offset != null){
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
      data: records.rows as PersonDTO[],
      status: {
        code: 200,
        message: "Successfull!",
        success: true,
      },
      meta: meta
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

export async function getPersonById(
  id: number
): Promise<ResponseEntry<PersonDTO | null>> {
  const Person = new PersonRepository();
  try {
    const record: any = await Person.getPersonById(id);
    return {
      data: record as PersonDTO,
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

export async function createPerson(
  data: PersonInput,
  user: UserDTO
): Promise<ResponseEntry<PersonDTO | null>> {
  const Person = new PersonRepository();
  const slug = toSlug(data.name);
  try {
    const record = await Person.createPerson({
      ...data,
      slug: slug,
      CreaterId: user.id,
    });
    return {
      data: record as PersonDTO,
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

export async function updatePerson(
  id: number,
  data: PersonInput
): Promise<ResponseEntry<PersonDTO | null>> {
  const Person = new PersonRepository();
  const { name, avatar, email, phone, position } = data;
  if (!name || !phone || !email || !position)
    return {
      data: null,
      status: {
        code: 406,
        message: "Invalid payload!",
        success: false,
      },
    };
  try {
    const person = await Person.getPersonById(id);
    // remove avatar
    let pathAvatar = "";
    if(data.imageAvatarName){
      if(person && person.imageAvatarName){
        pathAvatar = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_PROJECT, person.imageAvatarName);
      }
    }
    const record = await Person.updatePerson(id, data);
    if(pathAvatar){
      try{
        fs.unlinkSync(pathAvatar);
      }catch(error){
        console.error(error);
      }
    }
    return {
      data: record as PersonDTO,
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

export async function updatePersonFields(
  id: number,
  data: Partial<PersonInput>
): Promise<ResponseEntry<PersonDTO | null>> {
  const Person = new PersonRepository();
  try {
    const person = await Person.getPersonById(id);
    // remove avatar
    let pathAvatar = "";
    if(data.imageAvatarName){
      if(person && person.imageAvatarName){
        pathAvatar = path.join(process.env.ROOT_FOLDER, process.env.UPLOAD_PATH, process.env.FOLDER_PROJECT, person.imageAvatarName);
      }
    }
    const record = await Person.updatePerson(id, data);
    if(pathAvatar){
      try{
        fs.unlinkSync(pathAvatar);
      }catch(error){
        console.error(error);
      }
    }
    return {
      data: record as PersonDTO,
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

export async function deletePerson(
  id: number
): Promise<ResponseEntry<boolean>> {
  const Person = new PersonRepository();
  try {
    const result = await Person.deletePerson(id);
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

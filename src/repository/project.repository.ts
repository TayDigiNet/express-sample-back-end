import { QueryOptions, QueryResponse } from "./../dto/typings.dto";
import DBContext from "../entities";
import { Op, Sequelize } from "sequelize";
import ProjectInterface from "../interfaces/project.interface";
import ProjectDTO, { ProjectInput } from "../dto/project.dto";
import UserDTO from "../dto/user.dto";
import { ROLE } from "../configs/constants";
import { PublicUserDTO } from "../dto/user.dto";

export default class ProjectRepository implements ProjectInterface {
  private Project = DBContext.getConnect().project;
  private Users = DBContext.getConnect().users;
  private Person = DBContext.getConnect().person;
  private ProjectOperators = DBContext.getConnect().projectOperators;
  private ProjectImages = DBContext.getConnect().projectImage;
  private Role = DBContext.getConnect().role;
  private Wishlist = DBContext.getConnect().wishlist;
  private Like = DBContext.getConnect().like;

  async getProjects(
    data?: Partial<QueryOptions & { ProjectCategoryId: number; CreaterId: number; user: UserDTO; unexpired: string, userRole: boolean, requestApproved: boolean, published: boolean, ToDate: Date, FromDate: Date, allExcludeRequestApproved: boolean, draft: string }>
  ): Promise<QueryResponse<ProjectDTO>> {
    let includes: any = [];
    let filters: any = {};
    let query: any = {};

    if(data?.user !== undefined || data?.userRole !== undefined || (typeof data?.populate !== "undefined" && (data?.populate === "*" || data?.populate.includes("creater")))){
      if(data?.userRole !== undefined){
        includes = [...includes, { model: this.Users, as: "creater", required: true, include: {model: this.Role, as: "role", required: true, where: {name: "user"}} }];
      }
      else{
        includes = [...includes, { model: this.Users, as: "creater", attributes: PublicUserDTO}];
      }
    }

    if (typeof data?.search === "string") {
      filters[Op.or] = [
        {
          name: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          content: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          plan: {
            [Op.like]: "%" + data.search + "%",
          },
        },
        {
          description: {
            [Op.like]: "%" + data.search + "%",
          },
        },
      ];
    }
    if (data?.ProjectCategoryId !== undefined) {
      filters.ProjectCategoryId = data.ProjectCategoryId;
    }
    if (typeof data?.CreaterId === "number") {
      filters.CreaterId = data.CreaterId;
    }
    if(data?.user !== undefined){
      filters.CreaterId = data?.user?.id;
    }
    if(data?.unexpired !== undefined){
      filters.expiredAt = {
        [Op.gt]: Sequelize.literal('NOW()')
      }
    }
    if(data?.requestApproved !== undefined){
      filters.requestApproved = true;
    }
    if(data?.published !== undefined){
      filters.published = true;
    }
    if(data?.allExcludeRequestApproved !== undefined){
      filters.requestApproved = {
        [Op.not]: true
      }
    }
    if(data && data.FromDate && data.ToDate){
      filters[Op.and] = [{
        createdAt: {
          [Op.gt]: data.FromDate
        }
      },
      {
        createdAt: {
          [Op.lt]: data.ToDate
        }
      }];
    }
    if(data?.draft !== undefined){
      if(JSON.parse(data.draft)){
        filters.draft = true;
      }
      else{
        filters.draft = false;
      }
    }

    let sort: any = [];
    if (typeof data?.sort !== "undefined") {
      sort = data.sort.map((s) => [s.sortColumn, s.sortType]);
    } else {
      sort = [["updatedAt", "desc"]];
    }
    
    if (typeof data?.populate !== "undefined") {
      if (data?.populate === "*") {
        includes = [
          ...includes,
          {
            model: this.Person,
            as: "projectOperators",
          },
          {
            model: this.Person,
            as: "representative",
          },
          { model: this.ProjectImages, as: "projectImages" }
        ];
      } else {
        if (data?.populate.includes("projectOperators")) {
          includes = [
            ...includes,
            {
              model: this.Person,
              as: "projectOperators",
            },
          ];
        }
        if (data?.populate.includes("representative")) {
          includes = [
            ...includes,
            {
              model: this.Person,
              as: "representative",
            },
          ];
        }
        if (data?.populate.includes("projectImages")) {
          includes = [...includes, { model: this.ProjectImages, as: "projectImages" }];
        }
      }
    }
    query = {
      attributes: { 
        include: [[Sequelize.literal("(SELECT COUNT(*) FROM Comments where Comments.ProjectId=Project.id)"), "commentCount"]]
      },
      where: filters,
      order: sort,
      include: includes,
      distinct: true
    }
    if(data && data.offset != null && data.limit != null){
      query.offset = data.offset;
      query.limit = data.limit;
    }

    const responses = await this.Project.findAndCountAll(query);

    /** Convert data */
    const rows = responses.rows.map((r: any) => {
      const ProjectOperatorsIds = r.projectOperators
        ? r.projectOperators.map((p: any) => p.dataValues.id)
        : [];
      return {
        ...r.dataValues,
        ProjectOperatorsIds: ProjectOperatorsIds,
      };
    });

    return {
      ...responses,
      rows,
    };
  }

  async getProjectById(data?: Partial<QueryOptions & { id: number, UserId: number }>): Promise<ProjectDTO | undefined> {
    let includes: any = [
      {
        model: this.Person,
        as: "projectOperators",
      },
      {
        model: this.Person,
        as: "representative",
      },
      { model: this.Users, as: "creater", attributes: PublicUserDTO },
      { model: this.ProjectImages, as: "projectImages" }
    ];
    if(data?.UserId !== undefined){
      includes = [
        ...includes,
        { model: this.Wishlist, required: false, as: "wishlistProjects", where:{ UserId: data.UserId} },
        { model: this.Like, required: false, as: "likeProjects", where:{ UserId: data.UserId} },
      ];
    }
    const record = await this.Project.findByPk(data?.id, {
      include: includes,
    });
    const projectOperators = await this.ProjectOperators.findAll({
      where: {
        ProjectId: data?.id,
      },
    });
    return {
      ...record.dataValues,
      ProjectOperatorsIds: projectOperators.map(
        (p: any) => p.dataValues.PersonId
      ),
    };
  }

  async createProject(
    data: ProjectInput & { slug: string; CreaterId: number }
  ): Promise<ProjectDTO | undefined> {
    const { ProjectOperatorsIds, ...inputData } = data;
    const newRecord = await this.Project.create({
      ...inputData,
      blocked: false,
      commentCount: 0,
      viewsCount: 0
    }, {
      include: [{
        model: this.ProjectImages,
        as: "projectImages",
      }]
    });
    if(data.ProjectOperatorsIds){
      let projectOperatorsIds = JSON.parse(data.ProjectOperatorsIds || "");
      for (const personId of projectOperatorsIds as number[]) {
        await this.ProjectOperators.create({
          PersonId: personId,
          ProjectId: newRecord.dataValues.id,
        });
      }
    }
    return {
      ...newRecord.dataValues,
      ProjectOperatorsIds: ProjectOperatorsIds,
    };
  }

  async updateProject(
    id: number,
    data: Partial<ProjectInput> & { UserId?: number }
  ): Promise<ProjectDTO | undefined> {
    const { ProjectOperatorsIds, ...inputData } = data;
    let record = await this.Project.findByPk(id);
    if(!record || (record && data.UserId && data.UserId != record.CreaterId)){
      throw "Not found the project";
    }
    await record.update({
      ...inputData,
    });
    if (ProjectOperatorsIds) {
      await this.ProjectOperators.destroy({
        where: {
          ProjectId: id,
        },
      });
      if(data.ProjectOperatorsIds){
        let projectOperatorsIds = JSON.parse(data.ProjectOperatorsIds || "");
        for (const personId of projectOperatorsIds as number[]) {
          await this.ProjectOperators.create({
            PersonId: personId,
            ProjectId: id,
          });
        }
      }
    }
    if(inputData.projectImages){
      for (const projectImage of inputData.projectImages) {
        await this.ProjectImages.create({
          ...projectImage,
          ProjectId: id,
        });
      }
    }

    record = await this.Project.findByPk(id, {include: [
      { model: this.ProjectImages, as: "projectImages" },
    ]});
    return {
      ...record.dataValues,
      ProjectOperatorsIds: ProjectOperatorsIds,
    };
  }
  async deleteProject(id: number): Promise<boolean> {
    await this.ProjectOperators.destroy({
      where: {
        ProjectId: id,
      },
    });
    const detroy = await this.Project.destroy({
      where: {
        id,
      },
    });
    return detroy;
  }
}

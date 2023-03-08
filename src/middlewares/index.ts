import { QueryOptions } from "./../dto/typings.dto";
import { NextFunction, Request, Response } from "express";

function globleMiddleware(req: Request, res: Response, next: NextFunction) {
  const { headers, path } = req;

  /** Change language style text */
  if (req.headers.language) {
    let language = req.headers.language as string;
    req.headers.language = language.toLowerCase();
  }

  const apiString = path.split("/")[1];
  if (apiString === "api") {
    if (headers["api-key"] == "APIKEYYYYY") return next();
    else
      return res.status(403).json({
        data: null,
        status: {
          code: 403,
          message: "Forbidden",
          success: false,
        },
      });
  } else return next();
}

function queryOptionsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const query: any = req.query;
  let options: Partial<QueryOptions> = {};
  if (typeof query.search !== "undefined") {
    options.search = query.search;
  }
  if (
    typeof query.pagination !== "undefined" &&
    typeof query.pagination.page === "string" &&
    typeof query.pagination.pageSize !== "undefined"
  ) {
    options.limit = parseInt(query.pagination.pageSize, 10);
    const offset =
      (parseInt(query.pagination.page, 10) - 1) *
      parseInt(query.pagination.pageSize, 10);
    options.offset = offset >= 0 ? offset : 0;
  }
  if (typeof query.sort === "string") {
    const sort = query.sort.split(":");
    options.sort = [{ sortColumn: sort[0], sortType: sort[1] || "asc" }];
  }
  if (typeof query.sort === "object") {
    options.sort = query.sort.map((s: string) => {
      const sort = s.split(":");
      return { sortColumn: sort[0], sortType: sort[1] || "asc" };
    });
  }
  if (typeof query.populate === "string") {
    options.populate = query.populate;
  }
  if (typeof query.populate === "object") {
    options.populate = query.populate;
  }
  res.locals.queryOptions = options;
  next();
}

export default {
  globleMiddleware,
  queryOptionsMiddleware,
};

import { NextFunction, Request, Response } from "express";
import RedisContext from "../cache/redis";

function cacheWithStartKey(key: string) {
  return async function newsCache(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const params = req.params;
    const id = params.id;
    const redis = RedisContext.getConnect();
    try {
      const dataRedis = await redis.get(`${key}:${id}`);
      if (dataRedis !== null) {
        return res.status(200).json({
          data: JSON.parse(dataRedis),
          status: {
            code: 200,
            message: "Successfull!",
            success: true,
          },
        });
      } else {
        return next();
      }
    } catch (error) {
      console.error(error);
      return next();
    }
  };
}

export default {
  cacheWithStartKey,
};

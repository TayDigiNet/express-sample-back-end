import { createClient } from "redis";

export default class RedisContext {
  private static client: any;
  constructor() {}
  static connect() {
    const redis_username = process.env.REDIS_CLIENT;
    const redis_password = process.env.REDIS_PASSWORD;
    const redis_host = process.env.REDIS_HOST;
    const redis_port = process.env.REDIS_PORT;

    const REDIS_URL = `redis://${redis_username}:${redis_password}@${redis_host}:${redis_port}`;

    this.client = createClient({
      socket: {
          host: redis_host,
          port: parseInt(redis_port as string, 6379)
      },
      password: redis_password
    });
  
    return this.client;
  }
  static getConnect() {
    if (this.client) {
      return this.client;
    } else {
      return this.connect();
    }
  }
}

import { SetOptions, createClient } from "redis";
import config from "../config";
import { errorLogger, infoLogger } from "./logger";

const redisClient = createClient({ url: config.redis.url });
const redisPubClient = createClient({ url: config.redis.url });
const redisSubClient = createClient({ url: config.redis.url });

const setupClient = (client: ReturnType<typeof createClient>, name: string) => {
  client.on("error", (error) => {
    errorLogger.error(`Redis ${name} error: ${error.message}`);
  });

  client.on("connect", () => {
    infoLogger.info(`Redis ${name} connected on URL - ${config.redis.url}`);
  });
};

setupClient(redisClient, "client");
setupClient(redisPubClient, "pubClient");
setupClient(redisSubClient, "subClient");

const connect = async (): Promise<void> => {
  try {
    await redisClient.connect();
    await redisPubClient.connect();
    await redisSubClient.connect();
  } catch (error) {
    errorLogger.error("Failed to connect to Redis", error);
    process.exit(1); // Exit the process if Redis fails to connect
  }
};

const disconnect = async (): Promise<void> => {
  try {
    await redisClient.quit();
    await redisPubClient.quit();
    await redisSubClient.quit();
  } catch (error) {
    errorLogger.error("Error disconnecting Redis clients", error);
  }
};

const set = async (key: string, value: string, options?: SetOptions): Promise<string> => {
  return (await redisClient.set(key, value, options)) as string;
};

const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

const expire = async (key: string, seconds: number): Promise<void> => {
  await redisClient.expire(key, seconds);
};

const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.set(key, token, { EX: Number(config.redis.expires_in) });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access-token:${userId}`;
  return await redisClient.get(key);
};

const getTokenBySessionId = async (sessionId: string): Promise<string | null> => {
  return await redisClient.get(`session:${sessionId}`);
};

const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.del(key);
};

export const RedisClient = {
  connect,
  disconnect,
  set,
  get,
  del,
  expire,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  getTokenBySessionId,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};

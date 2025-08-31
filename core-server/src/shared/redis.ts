import { SetOptions, createClient } from "redis";
import config from "../config";
import { errorLogger, infoLogger } from "./logger";

const redisClient = createClient({ url: config.redis.url });
const redisPubClient = createClient({ url: config.redis.url });
const redisSubClient = createClient({ url: config.redis.url });

// Log errors for all Redis clients
const handleError = (clientName: string, error: unknown) => {
  errorLogger.error(`${clientName} error:`, error);
};

redisClient.on("error", (error) => handleError("Redis Client", error));
redisPubClient.on("error", (error) => handleError("Redis Pub Client", error));
redisSubClient.on("error", (error) => handleError("Redis Sub Client", error));

redisClient.on("connect", () => {
  infoLogger.info(`Redis client connected to ${config.redis.url}`);
});

// Redis utility functions
const set = async (key: string, value: string, options?: SetOptions): Promise<void> => {
  try {
    await redisClient.set(key, value, options);
    infoLogger.info(`Key set: ${key}`);
  } catch (error) {
    errorLogger.error(`Failed to set key: ${key}`, error);
  }
};

const get = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    errorLogger.error(`Failed to get key: ${key}`, error);
    return null;
  }
};

const del = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
    infoLogger.info(`Key deleted: ${key}`);
  } catch (error) {
    errorLogger.error(`Failed to delete key: ${key}`, error);
  }
};

// Access token helpers
const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await set(key, token, { EX: Number(config.redis.expires_in) });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access-token:${userId}`;
  return await get(key);
};

const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await del(key);
};

// Connection and disconnection handlers
const connect = async (): Promise<void> => {
  try {
    await Promise.all([redisClient.connect(), redisPubClient.connect(), redisSubClient.connect()]);
    infoLogger.info("All Redis clients connected successfully.");
  } catch (error) {
    errorLogger.error("Failed to connect Redis clients.", error);
  }
};

const disconnect = async (): Promise<void> => {
  try {
    await Promise.all([redisClient.quit(), redisPubClient.quit(), redisSubClient.quit()]);
    infoLogger.info("All Redis clients disconnected successfully.");
  } catch (error) {
    errorLogger.error("Failed to disconnect Redis clients.", error);
  }
};

export const RedisClient = {
  connect,
  disconnect,
  set,
  get,
  del,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};

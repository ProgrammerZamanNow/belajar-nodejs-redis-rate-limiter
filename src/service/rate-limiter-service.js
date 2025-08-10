import {redis} from "../application/redis.js";

const EXPIRE_TIME = 60;
const MAX_REQUESTS = 10;

export const isAllowed = async (user) => {

  const key = user.username;

  const increment = await redis.incr(key);
  if (increment === 1) {
    await redis.expire(key, EXPIRE_TIME);
  }

  return increment <= MAX_REQUESTS
};
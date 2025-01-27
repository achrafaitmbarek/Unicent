import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

export async function rateLimiter(key: string, limit = 2, timeframe = 60): Promise<boolean> {
    const identifier = `ratelimit:${key}`
    const count = await redis.incr(identifier)
    
    if (count === 1) {
        await redis.expire(identifier, timeframe)
    }
    
    return count <= limit
}
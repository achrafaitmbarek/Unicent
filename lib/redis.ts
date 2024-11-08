import { Redis } from 'ioredis';

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    return "redis://localhost:6379";
};

// Add configuration options
const redis = new Redis(getRedisUrl(), {
    maxRetriesPerRequest: null, // or a higher number
    retryStrategy(times) {
        if (times > 3) {
            console.error('Redis connection failed after 3 retries');
            return null; // stop retrying
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError(err) {
        console.error('Redis reconnection error:', err);
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    },
});

// Add connection event handlers
redis.on('error', (error) => {
    console.error('Redis connection error:', error);
});

redis.on('connect', () => {
    console.log('Successfully connected to Redis');
});

export default redis;
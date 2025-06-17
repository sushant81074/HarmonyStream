const redis = require("redis");

let rClient = null;
let rPub = null;
let rSub = null;

const redisConnect = async () => {
    try {
        const url = process.env.REDIS_URL || "redis://localhost:6379";
        const password = process.env.REDIS_PASSWORD;

        if (rClient && rClient.isOpen) {
            console.log("✅ Redis connection successful");
            return rClient;
        }

        const client = redis.createClient({ url, password });

        client.on("error", (err) => console.error("❌ Redis Client Error:", err));
        client.on("ready", () => console.log("🚀 Redis is ready"));
        client.on("end", () => console.log("🔌 Redis connection closed"));
        client.on("reconnecting", () => console.log("♻️ Redis reconnecting..."));

        await client.connect();
        rClient = client;
        await setCache("foo", "bar", 1);
        console.log("✅ Redis connection successful");

        return rClient;
    } catch (error) {
        console.error("❌ Redis connection failed:", error);
        process.exit(1);
    }
};

const redisPubConnect = async () => {
    try {
        const url = process.env.REDIS_URL || "redis://localhost:6379";
        const password = process.env.REDIS_PASSWORD;

        if (rPub && rPub.isOpen) {
            console.log("✅ Redis connection successful");
            return rPub;
        }

        rPub = redis.createClient({ url, password });
        return await rPub.connect()
    } catch (error) {
        console.error("❌ Redis Pub connection failed:", error);
        process.exit(1);
    }
}

const redisSubConnect = async () => {
    try {
        const url = process.env.REDIS_URL || "redis://localhost:6379";
        const password = process.env.REDIS_PASSWORD;

        if (rSub && rSub.isOpen) {
            console.log("✅ Redis connection successful");
            return rSub;
        }

        rSub = redis.createClient({ url, password });
        return await rSub.connect()
    } catch (error) {
        console.error("❌ Redis Sub connection failed:", error);
        process.exit(1);
    }
}
const setCache = async (key, value, ttl = 3600) => {
    if (!rClient) await redisConnect();
    return await rClient.set(key, JSON.stringify(value), { EX: ttl });
};

const getCache = async (key) => {
    if (!rClient) await redisConnect();
    const data = await rClient.get(key);
    return data ? JSON.parse(data) : null;
};

const delCache = async (key) => {
    if (!rClient) await redisConnect();
    return await rClient.del(key);
};

const flushCache = async () => {
    if (!rClient) await redisConnect();
    return await rClient.flushAll();
};

// const enqueue = async (que, data) => {
//     if (!rClient) await redisConnect();
//     return await rClient.rPush(que, data);
// }

// const dequeue = async (que) => {
//     if (!rClient) await redisConnect();
//     return await rClient.lPop(que);
// }

// const getQueueData = async (que) => {
//     if (!rClient) await redisConnect();
//     return await rClient.lRange(que, 0, -1);
// }

// const clearQueue = async (que) => {
//     if (!rClient) await redisConnect();
//     return await rClient.lTrim(que, 1, 0);
// }

// const getQueueLength = async (que) => {
//     if (!rClient) await redisConnect();
//     return await rClient.lLen(que);
// }

// Pub/Sub placeholders
const redisPub = async (channel, message) => {
    if (!rPub) await redisPubConnect();
    return await rPub.publish(channel, JSON.stringify(message));
};

const redisSub = async (channel) => {
    if (!rSub) await redisSubConnect();
    const data = await rSub.subscribe(channel);
    return data ? JSON.parse(data) : null;
};

module.exports = {
    redisConnect,
    setCache,
    getCache,
    delCache,
    flushCache,
    // enqueue,
    // dequeue,
    // getQueueData,
    // clearQueue,
    // getQueueLength,
    redisPub,
    redisSub,
};

import { createClient } from "redis";
import session from "express-session";
import { RedisStore } from "connect-redis";

const redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASSWORD || "MshzPnnlUP1fpJK0Xyq9Q5I4wguK9gtv",
    socket: {
        host: "redis-10432.c9.us-east-1-2.ec2.redns.redis-cloud.com",
        port: 10432,
    },
});

redisClient.on("error", (err) => console.error("Redis Error", err));

(async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("🔥 Redis Connected Successfully");
        }
    } catch (err) {
        console.error("🚨 Redis Connection Failed:", err);
    }
})();


// Redis Session Store
export const sessionMiddleware = session({
    store: new RedisStore({
        client: redisClient,
        ttl: 86400, // Expire sessions after 24 hours (86400 seconds)
    }),
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
});


export default redisClient;

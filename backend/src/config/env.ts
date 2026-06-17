import { config } from "dotenv";
config();

export const env = {
    // server
    port: parseInt(process.env.PORT || "5000"),
    nodeEnv: process.env.NODE_ENV || "development",
    baseUrl: process.env.BASE_URL || "http://localhost:3001/api",

    // database
    databaseUrl: process.env.DATABASE_URL || "",

    // jwt
    jwtSecret: process.env.JWT_SECRET || "",
    jwtExpiry: process.env.JWT_EXPIRY || "7d",
    corsOrigin: process.env.CORS_ORIGINS || "https://linktree.lsskincare.id",
};

// validate critical env vars
if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is not set");
}
if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not set");
}

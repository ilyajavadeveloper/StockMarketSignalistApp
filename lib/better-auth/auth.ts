import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthUrl = process.env.BETTER_AUTH_URL;

if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
}

if (!betterAuthSecret) {
    throw new Error("BETTER_AUTH_SECRET is not defined");
}

if (!betterAuthUrl) {
    throw new Error("BETTER_AUTH_URL is not defined");
}

const globalForMongo = globalThis as unknown as {
    mongoClient: MongoClient | undefined;
};

const client =
    globalForMongo.mongoClient ??
    new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClient = client;
}

const db = client.db("signalist");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    secret: betterAuthSecret,
    baseURL: betterAuthUrl,

    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
    },

    plugins: [nextCookies()],
});
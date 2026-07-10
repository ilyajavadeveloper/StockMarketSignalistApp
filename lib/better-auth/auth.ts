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

type MongoGlobal = typeof globalThis & {
    betterAuthMongoClient?: MongoClient;
    betterAuthMongoPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as MongoGlobal;

const createMongoClient = () => {
    return new MongoClient(mongoUri, {
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 60_000,
        serverSelectionTimeoutMS: 15_000,
        connectTimeoutMS: 15_000,
    });
};

if (!globalForMongo.betterAuthMongoClient) {
    globalForMongo.betterAuthMongoClient = createMongoClient();
}

const client = globalForMongo.betterAuthMongoClient;

if (!globalForMongo.betterAuthMongoPromise) {
    globalForMongo.betterAuthMongoPromise = client
        .connect()
        .catch((error) => {
            globalForMongo.betterAuthMongoClient = undefined;
            globalForMongo.betterAuthMongoPromise = undefined;

            throw error;
        });
}

await globalForMongo.betterAuthMongoPromise;

const db = client.db("signalist");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,

        // Отключаем транзакции для более стабильной работы
        // в serverless-окружении.
        transaction: false,
    }),

    secret: betterAuthSecret,
    baseURL: betterAuthUrl,

    trustedOrigins: [
        betterAuthUrl,
    ],

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
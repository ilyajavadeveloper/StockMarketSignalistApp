import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

<<<<<<< HEAD
const uri = process.env.MONGODB_URI;
const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;
=======
const mongoUri = process.env.MONGODB_URI;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthUrl = process.env.BETTER_AUTH_URL;
>>>>>>> d72c697 (auth)

if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
}

<<<<<<< HEAD
if (!baseURL) {
    throw new Error("BETTER_AUTH_URL is not defined");
}

if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not defined");
}

const client = new MongoClient(uri, {

});
=======
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
>>>>>>> d72c697 (auth)

const db = client.db("signalist");

export const auth = betterAuth({
    baseURL,
    secret,

    database: mongodbAdapter(db, {
        client,
    }),

<<<<<<< HEAD
=======
    secret: betterAuthSecret,
    baseURL: betterAuthUrl,

>>>>>>> d72c697 (auth)
    emailAndPassword: {
        enabled: true,
    },

    plugins: [
        nextCookies(),
    ],
});
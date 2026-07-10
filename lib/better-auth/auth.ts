import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (!uri) {
    throw new Error("MONGODB_URI is not defined");
}

if (!baseURL) {
    throw new Error("BETTER_AUTH_URL is not defined");
}

if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not defined");
}

const client = new MongoClient(uri, {

});

const db = client.db("signalist");

export const auth = betterAuth({
    baseURL,
    secret,

    database: mongodbAdapter(db, {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    plugins: [
        nextCookies(),
    ],
});
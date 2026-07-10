"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

export interface WatchlistRecord {
    symbol: string;
    company: string;
    addedAt: string;
}

const getCurrentUserId = async (): Promise<string> => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("You must be signed in");
    }

    return session.user.id;
};

export const getCurrentUserWatchlist = async (): Promise<
    WatchlistRecord[]
> => {
    try {
        const userId = await getCurrentUserId();

        await connectToDatabase();

        const items = await Watchlist.find({ userId })
            .sort({ addedAt: -1 })
            .lean();

        return items.map((item) => ({
            symbol: String(item.symbol),
            company: String(item.company),
            addedAt:
                item.addedAt instanceof Date
                    ? item.addedAt.toISOString()
                    : new Date(item.addedAt).toISOString(),
        }));
    } catch (error) {
        console.error("GET_WATCHLIST_ERROR:", error);
        return [];
    }
};

export const getCurrentUserWatchlistSymbols = async (): Promise<
    string[]
> => {
    try {
        const userId = await getCurrentUserId();

        await connectToDatabase();

        const items = await Watchlist.find(
            { userId },
            { symbol: 1, _id: 0 }
        ).lean();

        return items.map((item) => String(item.symbol));
    } catch (error) {
        console.error("GET_WATCHLIST_SYMBOLS_ERROR:", error);
        return [];
    }
};

export const addStockToWatchlist = async ({
                                              symbol,
                                              company,
                                          }: {
    symbol: string;
    company: string;
}) => {
    const userId = await getCurrentUserId();

    const normalizedSymbol = symbol.trim().toUpperCase();
    const normalizedCompany = company.trim() || normalizedSymbol;

    if (!normalizedSymbol) {
        throw new Error("Stock symbol is required");
    }

    await connectToDatabase();

    await Watchlist.findOneAndUpdate(
        {
            userId,
            symbol: normalizedSymbol,
        },
        {
            $setOnInsert: {
                userId,
                symbol: normalizedSymbol,
                company: normalizedCompany,
                addedAt: new Date(),
            },
        },
        {
            upsert: true,
            new: true,
        }
    );

    revalidatePath("/");
    revalidatePath("/watchlist");
    revalidatePath(`/stocks/${normalizedSymbol}`);

    return {
        success: true,
        symbol: normalizedSymbol,
    };
};

export const removeStockFromWatchlist = async ({
                                                   symbol,
                                               }: {
    symbol: string;
}) => {
    const userId = await getCurrentUserId();
    const normalizedSymbol = symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
        throw new Error("Stock symbol is required");
    }

    await connectToDatabase();

    await Watchlist.deleteOne({
        userId,
        symbol: normalizedSymbol,
    });

    revalidatePath("/");
    revalidatePath("/watchlist");
    revalidatePath(`/stocks/${normalizedSymbol}`);

    return {
        success: true,
        symbol: normalizedSymbol,
    };
};
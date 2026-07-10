"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;
    return fallback;
};

export const signUpWithEmail = async ({
                                          email,
                                          password,
                                          fullName,
                                          country,
                                          investmentGoals,
                                          riskTolerance,
                                          preferredIndustry,
                                      }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            },
            headers: await headers(),
        });

        try {
            await inngest.send({
                name: "app/user.created",
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry,
                },
            });
        } catch (inngestError) {
            console.error("INNGEST_EVENT_ERROR:", inngestError);
        }

        console.log("SIGN_UP_SUCCESS");

        return {
            success: true,
            data: response,
        };
    } catch (error) {
        console.error("SIGN_UP_ERROR:", error);

        return {
            success: false,
            error: getErrorMessage(error, "Sign up failed"),
        };
    }
};

export const signInWithEmail = async ({
                                          email,
                                          password,
                                      }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
            headers: await headers(),
        });

        console.log("SIGN_IN_SUCCESS");

        return {
            success: true,
            data: response,
        };
    } catch (error) {
        console.error("SIGN_IN_ERROR:", error);

        return {
            success: false,
            error: getErrorMessage(error, "Sign in failed"),
        };
    }
};

export const signOut = async () => {
    try {
        await auth.api.signOut({
            headers: await headers(),
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error("SIGN_OUT_ERROR:", error);

        return {
            success: false,
            error: getErrorMessage(error, "Sign out failed"),
        };
    }
};
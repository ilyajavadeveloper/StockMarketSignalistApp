"use server";

import { after } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";

type AuthActionResult =
    | {
    success: true;
}
    | {
    success: false;
    error: string;
};

const getErrorMessage = (
    error: unknown,
    fallback: string,
): string => {
    if (error instanceof Error) {
        return error.message;
    }

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
                                      }: SignUpFormData): Promise<AuthActionResult> => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            },
            headers: await headers(),
        });

        after(async () => {
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
            } catch (error) {
                console.error("INNGEST_EVENT_ERROR:", error);
            }
        });

        return {
            success: true,
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
                                      }: SignInFormData): Promise<AuthActionResult> => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
            headers: await headers(),
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error("SIGN_IN_ERROR:", error);

        return {
            success: false,
            error: getErrorMessage(error, "Sign in failed"),
        };
    }
};

export const signOut = async (): Promise<AuthActionResult> => {
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
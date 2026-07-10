"use client";

<<<<<<< HEAD
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
=======
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
>>>>>>> d72c697 (auth)
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";

<<<<<<< HEAD
import { signUpWithEmail } from "@/lib/actions/auth.actions";

=======
>>>>>>> d72c697 (auth)
import {
    INVESTMENT_GOALS,
    PREFERRED_INDUSTRIES,
    RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
<<<<<<< HEAD
=======

import { signUpWithEmail } from "@/lib/actions/auth.actions";
>>>>>>> d72c697 (auth)

const SignUp = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            country: "US",
            investmentGoals: "Growth",
            riskTolerance: "Medium",
            preferredIndustry: "Technology",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data: SignUpFormData) => {
<<<<<<< HEAD
        try {
            const result = await signUpWithEmail(data);

            if (!result.success) {
                toast.error("Sign up failed", {
                    description:
                        result.error ||
                        "Failed to create an account.",
                });

                return;
            }

            toast.success("Account created successfully!");

            router.replace("/");
            router.refresh();
        } catch (error) {
            console.error("SIGN_UP_FORM_ERROR:", error);

            toast.error("Sign up failed", {
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to create an account.",
            });
        }
=======
        const result = await signUpWithEmail(data);

        if (!result.success) {
            toast.error("Sign up failed", {
                description: result.error || "Failed to create an account.",
            });

            return;
        }

        toast.success("Account created successfully");

        router.replace("/");
        router.refresh();
>>>>>>> d72c697 (auth)
    };

    return (
        <>
            <h1 className="form-title">
                Sign Up & Personalize
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
            >
                <InputField
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.fullName}
                    validation={{
                        required: "Full name is required",
                        minLength: {
                            value: 2,
<<<<<<< HEAD
                            message:
                                "Full name must be at least 2 characters",
=======
                            message: "Full name must be at least 2 characters",
>>>>>>> d72c697 (auth)
                        },
                    }}
                />

                <InputField
                    name="email"
                    label="Email"
                    placeholder="contact@jsmastery.com"
                    type="email"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
<<<<<<< HEAD
                            message: "Enter a valid email address",
=======
                            message: "Invalid email address",
>>>>>>> d72c697 (auth)
                        },
                    }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter a strong password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{
                        required: "Password is required",
                        minLength: {
                            value: 8,
<<<<<<< HEAD
                            message:
                                "Password must be at least 8 characters",
=======
                            message: "Password must be at least 8 characters",
>>>>>>> d72c697 (auth)
                        },
                    }}
                />

                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                />

                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
<<<<<<< HEAD
                    className="yellow-btn mt-5 w-full"
                >
                    {isSubmitting
                        ? "Creating Account..."
                        : "Start Your Investing Journey"}
=======
                    className="yellow-btn w-full mt-5"
                >
                    {isSubmitting ? "Creating Account..." : "Start Your Investing Journey"}
>>>>>>> d72c697 (auth)
                </Button>

                <FooterLink
                    text="Already have an account?"
                    linkText="Sign in"
                    href="/sign-in"
                />
            </form>
        </>
    );
};

export default SignUp;
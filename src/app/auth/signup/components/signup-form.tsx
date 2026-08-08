"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { PasswordInput } from "@/components/password-input";
import { Spinner } from "@/components/spinner";

const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormValues = z.infer<typeof SignUpSchema>;

const FIELD_CLASS =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
  });
  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      // First, directly sign up AND auto-confirm without email verification
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: "user",
          },
          // Skip email verification
          emailRedirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/dashboard`,
        },
      });

      if (signUpError) {
        throw signUpError;
      } // Immediately sign in with password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        throw signInError;
      }

      // Success - go directly to dashboard, no verification required.
      // See signin-form.tsx for why this isn't window.location.href.
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 animate-page-in">
        <h1 className="text-xl font-semibold text-foreground">Create an account</h1>
        <p className="mb-6 text-sm text-foreground/60">Get started with Template</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <input
                {...register("firstName")}
                type="text"
                aria-label="First Name"
                placeholder="First name"
                disabled={isLoading}
                className={FIELD_CLASS}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <input
                {...register("lastName")}
                type="text"
                aria-label="Last Name"
                placeholder="Last name"
                disabled={isLoading}
                className={FIELD_CLASS}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <input
            {...register("email")}
            type="email"
            aria-label="Email"
            placeholder="your@email.com"
            disabled={isLoading}
            className={FIELD_CLASS}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}

          <PasswordInput
            registerProps={register("password")}
            ariaLabel="Password"
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
            className={FIELD_CLASS}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {isLoading && <Spinner />}
            {isLoading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

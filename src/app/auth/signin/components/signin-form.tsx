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

const SignInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormValues = z.infer<typeof SignInSchema>;

const FIELD_CLASS =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
  });
  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      // Simple authentication without extra checks
      const response = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (response.error) {
        // Provide more specific error messages for common auth issues
        if (response.error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else if (response.error.message.includes("Email not confirmed")) {
          setError("Please verify your email before signing in.");
        } else {
          throw response.error;
        }
        return;
      }

      // A hard window.location.href reload here used to race the
      // SupabaseListener's own post-sign-in refresh (both firing off the
      // same signInWithPassword call), which is what produced the
      // double-reload flash. router.refresh() invalidates the client
      // router cache so /dashboard's server check sees the just-set
      // session cookie, then router.push does a normal soft navigation.
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 animate-page-in">
        <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
        <p className="mb-6 text-sm text-foreground/60">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {error && <p className="text-sm text-destructive">{error}</p>}

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
            autoComplete="current-password"
            className={FIELD_CLASS}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {isLoading && <Spinner />}
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

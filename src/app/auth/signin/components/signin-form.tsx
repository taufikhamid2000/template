"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const SignInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormValues = z.infer<typeof SignInSchema>;

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-white bg-red-500 rounded">{error}</div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          placeholder="your@email.com"
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <a
            href="/auth/forgot-password"
            className="text-xs text-blue-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <input
          {...register("password")}
          type="password"
          id="password"
          placeholder="••••••••"
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        variant="primary"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInForm from "./components/signin-form";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign In - Template",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  // Check for existing session on the server side
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getSession();

  // Force redirect if session exists
  if (data?.session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

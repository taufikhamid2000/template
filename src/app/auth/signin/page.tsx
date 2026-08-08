import { Metadata } from "next";
import { redirect } from "next/navigation";

import SignInForm from "./components/signin-form";
import { createServerClient } from "@/utils/supabase/server";

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

  return <SignInForm />;
}

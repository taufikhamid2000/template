import { Metadata } from "next";
import { redirect } from "next/navigation";

import SignUpForm from "./components/signup-form";
import { createServerClient } from "@/utils/supabase/server";
import { getDictionary } from "@/lib/get-dictionary";

export const metadata: Metadata = {
  title: "Sign Up - Template",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getSession();

  if (data?.session) {
    redirect("/dashboard");
  }

  const { t: dict } = await getDictionary();

  return <SignUpForm dict={dict} />;
}

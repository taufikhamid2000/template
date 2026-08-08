import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center animate-page-in">
      <h1 className="mb-4 text-4xl font-bold text-foreground">
        Welcome to the Template Project
      </h1>
      <p className="mb-8 text-lg text-foreground/60">
        A simple starter with authentication
      </p>

      <div className="flex gap-4">
        <Link href="/auth/signin">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="primary" size="lg">
            Sign Up
          </Button>
        </Link>
      </div>

      <div className="mt-16 w-full max-w-2xl rounded-2xl border border-border bg-muted/40 p-6">
        <h2 className="mb-4 text-sm font-medium text-foreground/60">Features</h2>
        <ul className="flex flex-col gap-2 text-left">
          <li className="flex items-center gap-2 text-foreground">
            <span className="rounded-full bg-accent/15 p-1 text-accent">✓</span>
            <span>Next.js 13+ App Router</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="rounded-full bg-accent/15 p-1 text-accent">✓</span>
            <span>TypeScript Configuration</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="rounded-full bg-accent/15 p-1 text-accent">✓</span>
            <span>Tailwind CSS</span>
          </li>
          <li className="flex items-center gap-2 text-foreground">
            <span className="rounded-full bg-accent/15 p-1 text-accent">✓</span>
            <span>Authentication with Supabase</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

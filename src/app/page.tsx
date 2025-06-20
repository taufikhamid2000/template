import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to the Template Project
      </h1>
      <p className="text-lg text-gray-100 mb-8">
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

      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <ul className="flex flex-col gap-2 text-left">
          <li className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
              ✓
            </span>
            <span>Next.js 13+ App Router</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
              ✓
            </span>
            <span>TypeScript Configuration</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
              ✓
            </span>
            <span>Tailwind CSS</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
              ✓
            </span>
            <span>Authentication with Supabase</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

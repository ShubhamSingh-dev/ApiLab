"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Chrome, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  const handleSocialSignIn = (provider: "github" | "google") => {
    signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-zinc-50 to-indigo-100 dark:from-zinc-900 dark:via-indigo-950 dark:to-zinc-800 flex items-center justify-center p-4">
      <div className="flex w-full max-w-4xl items-center gap-12">
        <div className="hidden md:block flex-shrink-0">
          <img
            src="/postboy.svg"
            alt="PostBoy Logo"
            className="w-96 h-96 object-contain"
          />
        </div>
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-indigo-100 dark:border-zinc-700 overflow-hidden ring-1 ring-indigo-50 dark:ring-0">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
                  PostBoy
                </h1>
              </Link>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                Welcome back
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Sign in to continue to your account
              </p>
            </div>

            {/* Social Sign In Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-indigo-200 dark:border-zinc-600 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200"
                onClick={() => handleSocialSignIn("github")}
              >
                <Github className="mr-3 h-5 w-5" />
                Continue with GitHub
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium border-indigo-200 dark:border-zinc-600 hover:bg-indigo-50 dark:hover:bg-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200"
                onClick={() => handleSocialSignIn("google")}
              >
                <Chrome className="mr-3 h-5 w-5" />
                Continue with Google
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

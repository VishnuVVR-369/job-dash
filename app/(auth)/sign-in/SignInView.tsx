"use client";

import { OctagonAlertIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

const SignInView = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const onSocial = async (provider: "github" | "google") => {
    setError("");
    setPending(true);

    try {
      // Social login typically triggers a redirect, so we don't need to handle the result here
      // The auth client will handle the redirect to the OAuth provider
      await authClient.signIn.social({
        provider: provider,
        callbackURL: "/dashboard",
      });

      // Note: This code may not execute if the browser redirects immediately
      // The actual success handling should be done on the callback page
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || "Social sign in failed");
      setPending(false);
    }
    // Don't set pending to false here since the page will redirect
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-center -mt-10 -mb-24">
      <Card className="overflow-hidden p-0 shadow-xl border-border/50">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="px-8 pt-10 pb-8 md:px-12 md:pt-12 md:pb-10 lg:px-16 lg:pt-16 lg:pb-12 flex items-center">
            <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-balance text-sm leading-relaxed">
                  Sign in to continue to your account
                </p>
              </div>
              {!!error && (
                <Alert
                  variant="destructive"
                  className="flex items-center gap-2 bg-destructive/10 border-destructive/20"
                >
                  <OctagonAlertIcon className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{error}</span>
                </Alert>
              )}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onSocial("google")}
                  disabled={pending}
                  className="h-12 w-full border-border/60 hover:border-border hover:bg-accent/50 transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-3 inline-block"
                  />
                  <span className="text-sm font-medium">
                    Continue with Google
                  </span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onSocial("github")}
                  disabled={pending}
                  className="h-12 w-full border-border/60 hover:border-border hover:bg-accent/50 transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="mr-3 inline-block"
                  />
                  <span className="text-sm font-medium">
                    Continue with GitHub
                  </span>
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col items-center justify-center p-8 lg:p-12">
            <div className="flex flex-col items-center gap-6 max-w-sm">
              <div className="relative">
                <Image
                  src="/logo.svg"
                  alt="Job Dash"
                  width={120}
                  height={120}
                  className="h-[120px] w-[120px] drop-shadow-xl"
                />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-3xl font-semibold tracking-tight">
                  Job Dash
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Your job search tracker
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs leading-relaxed px-4">
        By continuing, you agree to our{" "}
        <a
          // biome-ignore lint: No T&C for now
          href="#"
          className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          // biome-ignore lint: No Privacy Policy for now
          href="#"
          className="text-primary underline underline-offset-4 font-medium hover:text-primary/80 transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};

export default SignInView;

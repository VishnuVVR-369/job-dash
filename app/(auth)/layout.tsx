import type React from "react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 bg-muted">
      <div className="w-full max-w-md md:max-w-3xl ">
        <Card>{children}</Card>
      </div>
    </div>
  );
};

export default AuthLayout;

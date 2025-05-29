"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function LoginCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = authService.getToken();
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <div>ログインしてください</div>
        <button onClick={() => router.push("/login")}>ログイン画面へ</button>
      </div>
    );
  }
  
  return <div>{children}</div>;
}

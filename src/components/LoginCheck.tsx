"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtom";

export default function LoginCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [user] = useAtom(userAtom);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (token && user) {
    if (token) {
      setToken(token);
    } else {
      setToken(null);
    }
  }, [user]);

  //if (!token || !user) {
  if (!token) {
    return (
      <div>
        <div>ログインしてください</div>
        <button onClick={() => router.push("/login")}>ログイン画面へ</button>
      </div>
    );
  }
  return <div>{children}</div>;
}

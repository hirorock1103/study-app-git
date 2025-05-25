"use client";

import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtom";

export default function HeaderTemplate() {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">GitHub Repository</h1>
        <div className="flex items-center gap-4">
          <p>{user?.name || "ログインしていません"}</p>
          <button
            className="bg-white text-gray-800 px-4 py-2 rounded-md"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

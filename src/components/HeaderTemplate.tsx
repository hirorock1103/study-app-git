"use client";

import { useAuth } from "@/hooks/useAuth";

export default function HeaderTemplate() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">GitHub Repository</h1>
        <div className="flex items-center gap-4">
          <p>{user?.name || "ログインしていません"}</p>
          <button
            className="bg-white text-gray-800 px-4 py-2 rounded-md"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

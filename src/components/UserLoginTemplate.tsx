"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function UserLoginTemplate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, isLoading, errorMessage, successMessage, login } = useAuth();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <div className="p-2 text-center w-1/2 mx-auto">
      <div className="m-3">
        <h1 className="text-1xl font-bold">ユーザー認証(トークン)</h1>
      </div>

      <div className="m-3 flex flex-col">
        <label htmlFor="email" className="text-left">
          email
        </label>
        <input
          type="email"
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="m-3 flex flex-col">
        <label htmlFor="password" className="text-left">
          password
        </label>
        <input
          type="password"
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <button
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "処理中..." : "送信"}
        </button>
      </div>
      
      <div>
        {errorMessage && (
          <div className="error-message">
            <p>エラーメッセージ</p>
            <div className="error-message-content">{errorMessage}</div>
          </div>
        )}
        {successMessage && (
          <div className="success-message">
            <p>成功メッセージ</p>
            <div className="success-message-content">{successMessage}</div>
          </div>
        )}

        {user && (
          <div className="profile m-10">
            <p>プロフィール</p>
            <div className="profile-content p-2 border">
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

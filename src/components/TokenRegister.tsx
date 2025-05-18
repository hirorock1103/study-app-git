"use client";

import { useState } from "react";
import axios from "axios";

// axiosのインスタンスを作成
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default function TokenRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleRegister = async () => {
    try {
      // 登録リクエスト
      const response = await api.post("/api/user/register", {
        name,
        email,
        password,
      });

      // レスポンスからトークンを取得
      const token = response.data.token;

      // 以降のリクエストでトークンを使用
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("登録成功:", response.data);
    } catch (error) {
      alert("エラーが発生しました");
      console.log("error!");
      console.error(error);
      if (error instanceof axios.AxiosError) {
        alert("エラーが発生しました");
        const status = error.response?.status;
        const message = error.response?.data?.message || "エラーが発生しました";
        console.log(status, message);
        setErrorMessage(message);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
        placeholder="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <div>
        <button
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
          onClick={() => {
            alert("送信してもよろしいですか？");
            handleRegister();
          }}
        >
          送信
        </button>
      </div>
      <div>
        <div className="error-message">
          <p>エラーメッセージ</p>
          <div className="error-message-content">{errorMessage}</div>
        </div>
      </div>
    </div>
  );
}

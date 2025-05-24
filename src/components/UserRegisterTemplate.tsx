"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../types/api/user";

export default function UserRegisterTemplate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  //画面ロード時にランダム名をセット
  useEffect(() => {
    setName(Math.random().toString(36).substring(2, 15));
    setEmail(Math.random().toString(36).substring(2, 15) + "@example.com");
    setPassword(Math.random().toString(36).substring(2, 15));
  }, []);

  const handleRegister = async () => {
    try {
      // 登録リクエスト
      const response = await axios.post(
        "http://localhost:8080/api/user/register",
        {
          name,
          email,
          password,
        }
      );
      setSuccessMessage("登録成功" + response.data.token);
      localStorage.setItem("token", response.data.token);
      setOldPassword(password);
      //ローカルストレージからtokenを取得
      const tokenFromLocalStorage = localStorage.getItem("token");

      handleProfile();
    } catch (error) {
      setErrorMessage("エラーが発生しました");

      if (error instanceof axios.AxiosError) {
        const status = error.response?.status;
        let message = error.response?.data?.message || "エラーが発生しました";
        //messageがオブジェクトの場合がある
        if (typeof message === "object") {
          message = JSON.stringify(message);
        }
        //発生日時をセット
        setErrorMessage(
          status + " | " + message + " | " + new Date().toLocaleString()
        );
      }
    }

    //新しいメールにセット
    setEmail(Math.random().toString(36).substring(2, 15) + "@example.com");
    setPassword(Math.random().toString(36).substring(2, 15));
  };

  const handleProfile = async () => {
    //登録が完了したらprofile apiを呼び出し
    const tokenFromLocalStorage = localStorage.getItem("token");

    try {
      const profileResponse = await axios.get(
        "http://localhost:8080/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${tokenFromLocalStorage}`,
          },
        }
      );
      setSuccessMessage(
        "プロフィール取得成功" + profileResponse.data.data.name
      );
      //profile apiの結果をセット
      const user: User = {
        name: profileResponse.data.data.name,
        email: profileResponse.data.data.email,
        id: profileResponse.data.data.id,
        create_at: profileResponse.data.data.create_at,
        update_at: profileResponse.data.data.update_at,
      };
      setUser(user);
      console.log("user:", user);
    } catch (error) {
      setErrorMessage("プロフィール取得に失敗しました");
      console.log("error!");
      console.error(error);
      if (error instanceof axios.AxiosError) {
        const status = error.response?.status;
        let message = error.response?.data?.message || "エラーが発生しました";
        console.log(status, message);
      }
    }
  };

  return (
    <div className="p-2 text-center w-1/2 mx-auto">
      <div className="m-3">
        <h1 className="text-1xl font-bold">ユーザー登録(トークン)</h1>
      </div>

      <div className="m-3 flex flex-col">
        <label htmlFor="name" className="text-left">
          name
        </label>
        <input
          type="text"
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <div className="m-3 flex flex-col">
        <label htmlFor="email" className="text-left">
          email
        </label>
        <input
          type="text"
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div className="m-3 flex flex-col">
        <label htmlFor="password" className="text-left">
          password
        </label>
        <input
          type="text"
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>

      <div>
        <button
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded m-3"
          onClick={() => {
            handleRegister();
          }}
        >
          送信
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
              {user.email}
              <br />
              password: {oldPassword}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

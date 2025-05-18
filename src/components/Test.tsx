"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Test() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profile, setProfile] = useState("");

  interface User {
    name: string;
    email: string;
    password: string;
  }

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
      console.log("登録成功:", response.data);
      setSuccessMessage("登録成功" + response.data.token);
      localStorage.setItem("token", response.data.token);

      //ローカルストレージからtokenを取得
      const tokenFromLocalStorage = localStorage.getItem("token");
      handleProfile();
    } catch (error) {
      setErrorMessage("エラーが発生しました");

      console.log("error!");
      console.error(error);
      if (error instanceof axios.AxiosError) {
        const status = error.response?.status;
        let message = error.response?.data?.message || "エラーが発生しました";
        console.log(status, message);

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
      console.log("プロフィール取得成功:", profileResponse.data);
      setSuccessMessage("プロフィール取得成功");
      //profile apiの結果をセット
      const user = new User();
      user.name = profileResponse.data.data.name;
      user.email = profileResponse.data.data.email;
      user.password = profileResponse.data.data.password;

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
    <div>
      <h1>Test(トークン)</h1>
      <input
        type="text"
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
        placeholder="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
        placeholder="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />
      <input
        type="text"
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 m-3 max-w-sm"
        placeholder="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
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
        {profile && (
          <div className="profile">
            <p>プロフィール</p>
            <div className="profile-content">{profile}</div>
          </div>
        )}
      </div>
    </div>
  );
}

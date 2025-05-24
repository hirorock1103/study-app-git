"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface GitHubRepo {
  repo_name: string;
  repo_full_name: string;
  updated_at: string;
  pushed_at: string;
}

//githubからデータを取得
const getGithubData = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    // if (!baseUrl) {
    //   throw new Error("NEXT_PUBLIC_APP_URL is not defined");
    // }

    const response = await axios.get(
      // `${baseUrl}/api/github/repository?owner=hirorock1103&since=2025-05-10`,
      `http://localhost:8080/api/github/repository?owner=hirorock1103&since=2025-05-10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return null;
  }
};

export default function TopPageTemplate() {
  const [githubData, setGithubData] = useState<{ data: GitHubRepo[] } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGithubData()
      .then((data) => {
        if (data) {
          setGithubData(data);
        } else {
          setError("データの取得に失敗しました");
        }
      })
      .catch((err) => {
        setError("エラーが発生しました: " + err.message);
      });
  }, []);

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">GitHub Repository</h1>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid gap-4">
            {githubData?.data.map((repo) => (
              <div
                key={repo.repo_name}
                className="border p-4 rounded-lg shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{repo.repo_name}</h2>
                <div className="text-gray-600 mb-2">{repo.repo_full_name}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">最終更新:</span>{" "}
                    {new Date(repo.updated_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">最終プッシュ:</span>{" "}
                    {new Date(repo.pushed_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface GitHubRepo {
  repo_name: string;
  repo_full_name: string;
  updated_at: string;
  pushed_at: string;
}

interface Commit {
  message: string;
  date: string;
  url: string;
  sha: string;
  branch: string;
}

interface Branch {
  name: string;
  commit_count: number;
  commits: Commit[];
}

//githubからデータを取得
const getGithubData = async (since: string, until: string) => {
  try {
    const baseUrl = "http://localhost:8080";
    const response = await axios.get(
      `${baseUrl}/api/github/repository?owner=hirorock1103&since=${since}&until=${until}`,
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

const getGithubBranches = async (repo_name: string, since: string) => {
  const baseUrl = "http://localhost:8080";
  const response = await axios.get(
    `${baseUrl}/api/github/graphql?owner=hirorock1103&repo=${repo_name}&email[0]=mdiz1103@gmail.com&email[1]=kobayashi_hiromu@moltsinc.co.jp&since=${since}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.branches as Branch[];
};

export default function TopPageTemplate() {
  const [githubData, setGithubData] = useState<{ data: GitHubRepo[] } | null>(
    null
  );
  //デフォルトは1週間前
  const [since, setSince] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // YYYY-MM-DD形式に変換
  );
  const [until, setUntil] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedCommits, setSelectedCommits] = useState<Commit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    handleFetchData();
  }, [since, until]);

  const handleFetchData = () => {
    getGithubData(since, until)
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
  };

  const handleOpenModal = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);

    getGithubBranches(repo.repo_name, since)
      .then((data) => {
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranch(data[0].name);
          setSelectedCommits(data[0].commits);
        }
      })
      .catch((err) => {
        setError("エラーが発生しました: " + err.message);
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRepo(null);
    setSelectedBranch(null);
    setSelectedCommits([]);
  };

  // ブランチ選択時のハンドラを追加
  const handleBranchChange = (branchName: string) => {
    setSelectedBranch(branchName);
    const selectedBranchData = branches.find((b) => b.name === branchName);
    if (selectedBranchData) {
      setSelectedCommits(selectedBranchData.commits);
    }
  };

  // 選択されたブランチのコミットのみをフィルタリング
  const filteredCommits = selectedCommits.filter(
    (commit) => commit.branch === selectedBranch
  );

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">GitHub Repository</h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">開始日:</label>
            <input
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              className="border rounded-md p-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">終了日:</label>
            <input
              type="date"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              className="border rounded-md p-1"
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          datepicker: {since} - {until}
        </div>

        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid gap-4">
            {githubData?.data.map((repo) => (
              <div
                key={repo.repo_name}
                className="border p-4 rounded-lg shadow"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold ">{repo.repo_name}</h2>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600"
                    onClick={() => handleOpenModal(repo)}
                  >
                    Open
                  </button>
                </div>
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

      {/* モーダル */}
      {isModalOpen && selectedRepo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedRepo.repo_name}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* ブランチ選択ドロップダウン */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ブランチを選択
              </label>
              <select
                value={selectedBranch || ""}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {branches.map((branch: Branch) => (
                  <option key={branch.name} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* コミット情報 */}
            <div className="space-y-4">
              <h3 className="font-semibold">コミット履歴</h3>
              {filteredCommits.map((commit) => (
                <div key={commit.sha} className="border p-3 rounded-md">
                  <p className="font-medium">{commit.message}</p>
                  <p className="text-sm text-gray-600">
                    日時: {new Date(commit.date).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    SHA: {commit.sha.substring(0, 7)}
                  </p>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    コミットを確認
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { getGithubBranches } from "@/features/github/services/getGithubBranches";
import { getGithubBranchesLatestCommit } from "@/features/github/services/getGithubBranchesLatestCommit";
import { useGithubRepo } from "@/store/githubRepoAtom";
import { useLoading } from "@/features/github/hooks/useLoading";
import Link from "next/link";

interface Branch {
  branchName: string;
  sha: number;
}

export default function GithubBranchTemplate() {
  const [since, setSince] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [until, setUntil] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  //useSearchParams
  const searchParams = useSearchParams();
  const repository_name = searchParams.get("repository_name");
  const [githubBranches, setGithubBranches] = useState<{
    data: Branch[];
  } | null>(null);
  const githubRepo = useGithubRepo();
  const { isLoading, startLoading, stopLoading } = useLoading();
  console.log("githubRepo", githubRepo);

  const [error, setError] = useState<string | null>(null);
  const [loadingBranches, setLoadingBranches] = useState<{
    [key: string]: boolean;
  }>({});
  const [responseMessages, setResponseMessages] = useState<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    handleFetchData();
  }, [repository_name, since, until]);

  const handleFetchData = () => {
    startLoading();
    getGithubBranches(repository_name || "", since, until)
      .then((data) => {
        setGithubBranches({ data: data });
        stopLoading();
      })
      .catch((err) => {
        setError("エラーが発生しました: " + err.message);
        stopLoading();
      });
  };

  const handleGetLatestCommit = async (branchName: string) => {
    setLoadingBranches((prev) => ({ ...prev, [branchName]: true }));
    setResponseMessages((prev) => ({ ...prev, [branchName]: null }));
    try {
      const response = await getGithubBranchesLatestCommit(
        repository_name || "",
        branchName,
        since
      );
      console.log("response", response);
      setResponseMessages((prev) => ({
        ...prev,
        [branchName]: response.message,
      }));
    } catch (err) {
      setError("コミットの取得に失敗しました: " + (err as Error).message);
      setResponseMessages((prev) => ({
        ...prev,
        [branchName]: (err as Error).message,
      }));
    } finally {
      setLoadingBranches((prev) => ({ ...prev, [branchName]: false }));
    }
  };

  return (
    <div className="p-4">
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          データ取得中...
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold mb-4">
          GitHub Repository: {githubRepo?.repo_name}
        </h1>
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
            {githubBranches?.data.map((branch) => (
              <div
                key={branch.branchName}
                className="border p-4 rounded-lg shadow"
                data-repo={branch.branchName}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold ">
                    {branch.branchName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      className={`bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600 flex items-center gap-2 ${
                        loadingBranches[branch.branchName]
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleGetLatestCommit(branch.branchName)}
                      disabled={loadingBranches[branch.branchName]}
                    >
                      {loadingBranches[branch.branchName] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          処理中...
                        </>
                      ) : (
                        "最新コミットを取得"
                      )}
                    </button>
                    <Link
                      href={`/github/branch?branch_name=${branch.branchName}&repository_name=${repository_name}`}
                    >
                      <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600">
                        詳細
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="text-gray-600 mb-2">{branch.sha}</div>
                {responseMessages[branch.branchName] && (
                  <span className="mt-2 text-sm text-green-700">
                    {responseMessages[branch.branchName]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { getGithubBranches } from "@/features/github/services/getGithubBranches";
import { getGithubBranchesLatestCommit } from "@/features/github/services/getGithubBranchesLatestCommit";
import { useAtomValue } from "jotai";
import { githubRepoAtom } from "@/atoms/githubRepoAtom";
import { useGithubRepo } from "@/store/githubRepoAtom";

interface Branch {
  branchName: string;
  sha: number;
}

export default function GithubBranchTemplate() {
  const [since, setSince] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // YYYY-MM-DD形式に変換
  );
  //useSearchParams
  const searchParams = useSearchParams();
  const repository_name = searchParams.get("repository_name");
  const [githubBranches, setGithubBranches] = useState<{
    data: Branch[];
  } | null>(null);
  const githubRepo = useGithubRepo();
  console.log("githubRepo", githubRepo);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleFetchData();
  }, [repository_name, since]);

  const handleFetchData = () => {
    getGithubBranches(repository_name || "")
      .then((data) => {
        setGithubBranches({ data: data });
      })
      .catch((err) => {
        setError("エラーが発生しました: " + err.message);
      });
  };

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          GitHub Repository: {githubRepo?.repo_name}
        </h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              日付を選択:
            </label>
            <input
              type="date"
              value={since}
              onChange={(e) => setSince(e.target.value)}
              className="border rounded-md p-1"
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">datepicker: {since}</div>

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
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600"
                    onClick={() =>
                      getGithubBranchesLatestCommit(
                        repository_name || "",
                        branch.branchName,
                        since
                      )
                    }
                  >
                    最新コミットを取得
                  </button>
                </div>
                <div className="text-gray-600 mb-2">{branch.sha}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

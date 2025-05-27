"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Commit {
  id: number;
  branchName: string;
  sha: string;
  repositoryId: number;
  userId: number;
  commitName: string;
  commitEmail: string;
  commitDate: string;
  commitMessage: string;
  commitUrl: string;
  files: string;
}

export default function GithubBranchDetail({
  branchName,
  repositoryName,
}: {
  branchName: string;
  repositoryName: string;
}) {
  const [commitHistory, setCommitHistory] = useState<Commit[]>([]);

  const handleFetchCommits = async () => {
    const baseUrl = "http://localhost:8080";
    const response = await axios.get(
      `${baseUrl}/api/user/github/db/commits?repository_name=${repositoryName}&branch_name=${branchName}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data.data);
    setCommitHistory(response.data.data);
  };

  useEffect(() => {
    handleFetchCommits();
  }, [branchName, repositoryName]);

  return (
    <>
      {/* list commits list */}
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Commits</h1>
        <ul className="list-disc list-inside ml-4">
          {commitHistory.map((commit) => (
            <li
              key={commit.id}
              className="border-b border-gray-300 py-2 space-y-2 flex justify-between"
            >
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">
                  {commit.commitDate.split("T")[0]}
                </p>
                <p>{commit.commitMessage}</p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600">
                開閉式
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

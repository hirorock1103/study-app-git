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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  commit: Commit | null;
}

const CommitDetailModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  commit,
}) => {
  if (!isOpen || !commit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
          <h2 className="text-xl font-bold">コミット詳細</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-2">
          <dt className="font-semibold">コミッター名:</dt>
          <dd>{commit.commitName}</dd>
          <dt className="font-semibold">message:</dt>
          <dd>{commit.commitMessage}</dd>
          <dt className="font-semibold">メール:</dt>
          <dd>{commit.commitEmail}</dd>
          <dt className="font-semibold">コミット日時:</dt>
          <dd>{commit.commitDate}</dd>
          <dt className="font-semibold">コミットURL:</dt>
          <dd>
            <a
              href={commit.commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              リンク
            </a>
          </dd>
          <dt className="font-semibold col-span-2">変更ファイル:</dt>
          <dd className="col-span-2">
            <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-4 rounded">
              {JSON.stringify(JSON.parse(commit.files), null, 2)}
            </pre>
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default function GithubBranchDetail({
  branchName,
  repositoryName,
}: {
  branchName: string;
  repositoryName: string;
}) {
  const [commitHistory, setCommitHistory] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (commit: Commit) => {
    setSelectedCommit(commit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCommit(null);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Commits</h1>
        <ul className="list-disc list-inside ml-4">
          {commitHistory.map((commit) => (
            <li
              key={commit.id}
              className="border-b border-gray-300 py-2 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">
                    {commit.commitDate.split("T")[0]}
                  </p>
                  <p>{commit.commitMessage}</p>
                </div>
                <button
                  onClick={() => openModal(commit)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md text-xs hover:bg-blue-600"
                >
                  詳細
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <CommitDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        commit={selectedCommit}
      />
    </>
  );
}

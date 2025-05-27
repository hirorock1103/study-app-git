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
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (!commit) return;

    const commitInfo = `
コミッター名: ${commit.commitName}
メッセージ: ${commit.commitMessage}
メール: ${commit.commitEmail}
コミット日時: ${commit.commitDate}
コミットURL: ${commit.commitUrl}
変更ファイル:
${JSON.stringify(JSON.parse(commit.files), null, 2)}
    `.trim();

    try {
      await navigator.clipboard.writeText(commitInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  if (!isOpen || !commit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
          <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
            <h2 className="text-xl font-bold">コミット詳細</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCopyAll}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="全ての情報をコピー"
              >
                {copied ? "✓ コピー完了" : "📋 全てコピー"}
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
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
  // デフォルトは1週間前
  const [since, setSince] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  const handleFetchCommits = async () => {
    const baseUrl = "http://localhost:8080";
    const response = await axios.get(
      `${baseUrl}/api/user/github/db/commits?repository_name=${repositoryName}&branch_name=${branchName}&since=${since}`,
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
  }, [branchName, repositoryName, since]);

  const openModal = (commit: Commit) => {
    setSelectedCommit(commit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCommit(null);
  };

  // 選択した日付以降のコミットのみをフィルタリング
  const filteredCommits = commitHistory.filter(
    (commit) => new Date(commit.commitDate) >= new Date(since)
  );

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Commits</h1>
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
        <ul className="space-y-2">
          {commitHistory.map((commit) => (
            <li key={commit.id} className="border-b border-gray-300 py-2">
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

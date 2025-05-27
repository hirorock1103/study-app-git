"use client";
import GithubBranchDetail from "@/components/GithubBranchDetail";
import { useSearchParams } from "next/navigation";

export default function GithubBranchPage() {
  const searchParams = useSearchParams();
  const branchName = searchParams.get("branch_name") || "";
  const repositoryName = searchParams.get("repository_name");
  return (
    <GithubBranchDetail
      branchName={branchName}
      repositoryName={repositoryName || ""}
    />
  );
}

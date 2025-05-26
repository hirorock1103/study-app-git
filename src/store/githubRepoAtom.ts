import { atom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import { GitHubRepo } from "@/types/api/github_repo";

export const githubRepoAtom = atom<GitHubRepo | null>(null);

export const useGithubRepo = () => useAtomValue(githubRepoAtom);
export const useGithubRepoDispatch = () => useSetAtom(githubRepoAtom);

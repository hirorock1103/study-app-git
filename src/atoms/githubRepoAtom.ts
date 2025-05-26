import { atom } from "jotai";
import { GitHubRepo } from "@/types/api/github_repo";

export const githubRepoAtom = atom<GitHubRepo | null>(null);

import { atom } from "jotai";
import { User } from "@/types/api/user";

export const userAtom = atom<User | null>(null);

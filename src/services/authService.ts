import axios from "axios";
import { User } from "@/types/api/user";

const BASE_URL = "http://localhost:8080";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

const getAuthToken = () => localStorage.getItem("token");

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${BASE_URL}/api/user/login`, credentials);
    const token = response.data.access_token || response.data.token;
    localStorage.setItem("token", token);
    return { token };
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${BASE_URL}/api/user/register`, userData);
    const token = response.data.token;
    localStorage.setItem("token", token);
    return { token };
  },

  async getProfile(): Promise<User> {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return getAuthToken();
  }
};

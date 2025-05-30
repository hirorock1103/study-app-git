import { useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { userAtom } from "@/store/userAtom";
import { authService, LoginRequest, RegisterRequest } from "@/services/authService";
import { formatError } from "@/utils/errorHandler";

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const { token } = await authService.login(credentials);
      setSuccessMessage("ログイン成功" + token);
      
      const userData = await authService.getProfile();
      setUser(userData);
      
      router.push("/");
    } catch (error) {
      setErrorMessage(formatError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const { token } = await authService.register(userData);
      setSuccessMessage("登録成功" + token);
      
      const userProfile = await authService.getProfile();
      setUser(userProfile);
    } catch (error) {
      setErrorMessage(formatError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    isLoading,
    errorMessage,
    successMessage,
    login,
    register,
    logout,
    setErrorMessage,
    setSuccessMessage
  };
};

import axios from "axios";

export const formatError = (error: unknown): string => {
  if (error instanceof axios.AxiosError) {
    const status = error.response?.status;
    let message = error.response?.data?.message || "エラーが発生しました";
    
    if (typeof message === "object") {
      message = JSON.stringify(message);
    }
    
    return `${status} | ${message} | ${new Date().toLocaleString()}`;
  }
  
  return "予期しないエラーが発生しました";
};

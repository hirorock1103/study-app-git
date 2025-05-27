import { useState } from "react";

export const useLoading = (defaultValue: boolean = false) => {
  const [isLoading, setIsLoading] = useState(defaultValue);

  return {
    isLoading,
    startLoading: () => setIsLoading(true),
    stopLoading: () => setIsLoading(false),
  };
};

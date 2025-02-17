import { useState, useCallback } from "react";
import { axiosInstance } from "../api/axiosConfig";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(
    async ({
      endpoint,
      method = "GET",
      params = {},
      data = null,
      onSuccess = () => {},
      onError = () => {},
    }) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance({
          method,
          url: endpoint,
          params,
          data,
        });
        
        onSuccess(response.data);
        return response.data;
      } catch (err) {
        console.error("API Error:", err);
        setError(err);
        onError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    fetchData,
  };
};

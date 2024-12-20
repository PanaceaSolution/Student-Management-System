import Alert from "@/components/common/Alert";
import useStudent from "@/Zustand/useStudent";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const useGetAllStudents = (query) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { students, setStudents } = useStudent();
  const URL = import.meta.env.VITE_API_URL;
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/student${query}/student`);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data.sort((a, b) => a - b));
    } catch (err) {
      setError(err.message);
      toast.error(err?.message, {
        position: "top-right"
      })
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, error };
};

export default useGetAllStudents;

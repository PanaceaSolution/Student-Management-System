
import React, { useState, useEffect, useCallback } from 'react';

const useGetAllStudents = (query) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(`http://localhost:8080/student${query}`)
  const URL = import.meta.env.VITE_API_URL;
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/student/all-students`);

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data.student);
    } catch (err) {
      setError(err.message);
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

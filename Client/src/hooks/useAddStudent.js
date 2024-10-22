// src/hooks/useAddStudent.js
import { useState } from 'react';

const useAddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const URL = import.meta.env.VITE_API_URL

  const addStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log(studentData);

    try {
      const response = await fetch(`${URL}/student/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      setSuccess(true);
      return await response.json(); // Optionally return the created student data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    addStudent,
    loading,
    error,
    success,
  };
};

export default useAddStudent;

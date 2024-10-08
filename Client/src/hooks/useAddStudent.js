// src/hooks/useAddStudent.js
import { useState } from 'react';

const useAddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/student', {
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

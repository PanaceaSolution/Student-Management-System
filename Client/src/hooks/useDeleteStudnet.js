// src/hooks/useDeleteStudent.js
import { useState } from 'react';

const useDeleteStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteStudent = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:8080/student/${id}`, { 
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      setSuccess(true);
      return await response.json(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteStudent,
    loading,
    error,
    success,
  };
};

export default useDeleteStudent;

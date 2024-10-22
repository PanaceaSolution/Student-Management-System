// src/hooks/useAddStudent.js
import useStudent from "@/Zustand/useStudent";
import { useState } from "react";

const useAddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { students, setStudents } = useStudent();
  const addStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log(studentData);

    try {
      const response = await fetch("http://localhost:8080/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      setSuccess(true);
      const data = await response.json();
      setStudents([...students, data])
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

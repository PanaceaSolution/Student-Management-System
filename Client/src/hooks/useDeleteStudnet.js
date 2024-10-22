// src/hooks/useDeleteStudent.js
import useStudent from "@/Zustand/useStudent";
import { useState } from "react";
import toast from "react-hot-toast";

const useDeleteStudent = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { students, setStudents } = useStudent();
  const deleteStudent = async (id) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:8080/student/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      setSuccess(false);
      const newStudentData = students.filter((student) => student.id !== id);
      setStudents(newStudentData);
      toast.success("Deleted SuccessFully!!",{
        position:"top-right"
      })
      return await response.json();
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteStudent,
    loading,
    success,
  };
};

export default useDeleteStudent;

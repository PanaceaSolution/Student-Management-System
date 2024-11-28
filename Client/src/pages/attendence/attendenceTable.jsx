import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentsByClassAndSectionService } from "@/services/studentService";
import useAttendanceStore from "@/store/attendenceStore";
import Spinner from "@/components/Loader/Spinner";


const AttendanceTable = () => {
  const { className, section } = useParams();
  const [attendance, setAttendance] = useState([]);
  const { saveAttendence, isSubmitting } = useAttendanceStore();
  console.log("Class Name:", className, "Section:", section);
  const navigate = useNavigate();
  const dates = dayjs().format("YYYY-MM-DD"); // Static Dates
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsByClassAndSectionService(
          className,
          section
        );
        if (response.success && Array.isArray(response.data.students)) {
          setAttendance(
            response.data.students.map((student) => ({
              rollNumber: student.rollNumber,
              fname: student.firstName,
              lname: student.lastName,
              isPresent: "-", // Change to isPresent to match the expected structure
            }))
          );
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [className, section]);

  const handleAttendanceChange = (rollNumber, value) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((student) =>
        student.rollNumber === rollNumber
          ? { ...student, isPresent: value }
          : student
      )
    );
  };

    const handleSubmitAttendence = async () => {
      try {
        const attendanceData = {
          className,
          section,
          date: dates,
          students: attendance,
        };
        console.log("Submitting attendanceData:", attendanceData);
        const response = await saveAttendence(attendanceData);
        if (response.success) {
          console.log("Attendance submitted successfully");
        } else {
          console.error("Failed to submit attendance");
        }
      } catch (error) {
        console.error("Error submitting attendance:", error);
      }
    };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => navigate("/attendence")}
      >
        Back to Dashboard
      </button>
      <h1 className="text-xl font-bold mb-4">
        Attendance for Class {className}, Section {section}
      </h1>
      <table className="min-w-full border-collapse border border-gray-200 bg-white rounded-md">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Roll Number</th>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">{dates}</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(({ rollNumber, fname, lname, attendance }) => (
            <tr key={rollNumber}>
              <td className="border border-gray-300 px-4 py-2">{rollNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{fname}</td>
              <td className="border border-gray-300 px-4 py-2">{lname}</td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={attendance}
                  onChange={(e) =>
                    handleAttendanceChange(rollNumber, e.target.value)
                  }
                  className="border border-gray-300 px-2 py-1 rounded"
                >
                  <option>--</option>
                  <option value="P">P</option>
                  <option value="A">A</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleSubmitAttendence} 
          disabled = {isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex justify-center items-center gap-2 cursor-not-allowed">
            <Spinner />
            <p>Submitting Attendence</p>
            </div>
          ) : (
            <p>Submit Attendence</p>
          )}
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Generate Sheet
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;

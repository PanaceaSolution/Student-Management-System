import { useParams, useNavigate } from "react-router-dom";

const students = [
  { rollNumber: 1, fname: "Saroj", lname: "Adhikari" },
  { rollNumber: 2, fname: "Ashutosh", lname: "Poudel" },
  { rollNumber: 3, fname: "Aryan", lname: "KC" },
  { rollNumber: 4, fname: "Sukraj", lname: "Chaudhary" },
  { rollNumber: 5, fname: "Nikesh", lname: "Stha" },
  { rollNumber: 6, fname: "Saurakchya", lname: "Sir" },
];

const AttendanceTable = () => {
  const { className, section } = useParams();
  console.log("Class Name:", className, "Section:", section);
  const navigate = useNavigate();

  const dates = ["02-02-2024", "03-02-2024", "04-02-2024", "05-02-2024"]; // Static Dates

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
            {dates.map((date) => (
              <th key={date} className="border border-gray-300 px-4 py-2">
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map(({ rollNumber, fname, lname }) => (
            <tr key={rollNumber}>
              <td className="border border-gray-300 px-4 py-2">{rollNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{fname}</td>
              <td className="border border-gray-300 px-4 py-2">{lname}</td>
              {dates.map((date, index) => (
                <td key={index} className="border border-gray-300 px-4 py-2">
                  {/* Static attendance options */}
                  <select className="p-1 border rounded">
                    <option value="">--</option>
                    <option value="P">P</option>
                    <option value="A">A</option>
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit Attendance
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Generate Sheet
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;

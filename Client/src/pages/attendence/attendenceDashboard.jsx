import { useNavigate } from "react-router-dom";

const classes = [
  { className: "10", section: "A", teacher: "Ram Bahadur" },
  { className: "10", section: "B", teacher: "Sita Thapa" },
  { className: "9", section: "C", teacher: "Hari Karki" },
];

const AttendanceDashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (className, section) => {
    navigate(`/attendence/${className}/${section}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Attendance Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(({ className, section, teacher }) => (
          <div
            key={`${className}-${section}`}
            className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
            onClick={() => handleCardClick(className, section)}
          >
            <h2 className="text-lg font-bold">Class: {className}</h2>
            <p>Section: {section}</p>
            <p>Class Teacher: {teacher}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceDashboard;

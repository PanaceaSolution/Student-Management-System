import { useNavigate } from "react-router-dom";
import useClassStore from "@/store/classStore";
import { useEffect } from "react";

// const classes = [
//   { className: "10", section: "A",  },
//   { className: "10", section: "B", },
//   { className: "9", section: "C",  },
// ];

const AttendanceDashboard = () => {
  const navigate = useNavigate();
    const { classes, getAllClasses, error } = useClassStore();

    useEffect( ()=>{
      const fetchAllClasses = async () =>{
      await getAllClasses()
      }
      fetchAllClasses()
    },[]);

  const handleCardClick = (className, section) => {
    navigate(`/attendence/${className}/${section}`);
  };

   if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Attendance Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(({ className, section }) => (
          <div
            key={`${className}-${section}`}
            className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
            onClick={() => handleCardClick(className, section)}
          >
            <h2 className="text-lg font-bold">Class: {className}</h2>
            <p>Section: {section}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceDashboard;

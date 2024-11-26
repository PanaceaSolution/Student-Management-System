
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


const AssignmentCard = ({ assignment }) => {
  const nav = useNavigate();
  return (
    <Card className="rounded-lg cursor-pointer" onClick={() => nav(`/task/${assignment.id}`)}>
      <CardHeader className="relative">
        <div className="relative">
          <img
            className="h-28 w-full object-cover rounded-lg"
            src={assignment.subjectPic}
            alt={`${assignment.subjectName} image`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-start justify-center rounded-lg p-2">
          </div>
        </div>
        <div className="absolute right-2 top-20 bg-white rounded-full p-1 shadow">
          <img
            className="h-14 w-14 rounded-full object-cover"
            src={assignment.teacherImg || teacher}
            alt={assignment.teacherName}
          />
        </div>
        <CardTitle>{assignment.subjectName}</CardTitle>
        <CardDescription>{assignment.teacherName}</CardDescription>
      </CardHeader>
      <CardContent className="relative border m-3 shadow-md rounded-lg p-2">
        <h1 className="text-sm md:text-base lg:text-md font-medium">
          {assignment.description}
        </h1>
        <p className="text-green-700 text-sm font-semibold">
          Assigned: {assignment.createDate}
        </p>
        <p className="text-red-600 text-sm font-semibold">
          Due: {assignment.dueDate}
        </p>
        <Badge variant="icon" className="absolute -top-1 -right-1 rounded-full h-2 w-2 animate-pulse transition-all duration-600 bg-blue-900" />
      </CardContent>
    </Card>

  );
};

export default AssignmentCard;

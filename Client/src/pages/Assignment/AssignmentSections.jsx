import React from "react";
import teacher from "../../assets/suk.jpg";
import { Maximize2 } from "lucide-react";

const data = [
  {
    id: 1,
    dueDate: "2024-11-15",
    createDate: "2024-10-01",
    subjectName: "Mathematics",
    teacherName: "Mr. Smith",
    teacherImg:
      "https://media.gettyimages.com/id/1056597018/photo/exxxotica-new-jersey-2018.webp?s=2048x2048&w=gi&k=20&c=JjVBTJFYRHrQZvukTA4qLvirQLpUUhOn3qLCRdnuv2M=",
    subjectPic:
      "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/1ac69ce5fbc389725f16f989fa53c62d6e1b4883/social%20icons/javascript.svg",
    description: "Complete the exercises from chapter 3.",
    assignments: [],
  },
  {
    id: 2,
    dueDate: "2024-11-20",
    createDate: "2024-10-05",
    subjectName: "PHP",
    teacherName: "Dr. Johnson",
    teacherImg:
      "https://media.gettyimages.com/id/1056597018/photo/exxxotica-new-jersey-2018.webp?s=2048x2048&w=gi&k=20&c=JjVBTJFYRHrQZvukTA4qLvirQLpUUhOn3qLCRdnuv2M=",
    subjectPic:
      "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/1ac69ce5fbc389725f16f989fa53c62d6e1b4883/social%20icons/javascript.svg",
    description: "Write a report on the properties of matter.",
    assignments: [],
  },
  {
    id: 3,
    dueDate: "2024-11-22",
    createDate: "2024-10-10",
    subjectName: "History",
    teacherName: "Ms. Lee",
    teacherImg: teacher,
    subjectPic:
      "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/1ac69ce5fbc389725f16f989fa53c62d6e1b4883/social%20icons/php.svg",
    description: "Research the causes of World War II.",
    assignments: [],
  },
  {
    id: 4,
    dueDate: "2024-11-25",
    createDate: "2024-10-12",
    subjectName: "Literature",
    teacherName: "Mrs. Brown",
    teacherImg: teacher,
    subjectPic:
      "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/62487087dc4f4f5efee637addbc67a16dd374bf6/text%20editors/sublime.svg",
    description: "Read 'To Kill a Mockingbird' and write a summary.",
    assignments: [],
  },
  {
    id: 5,
    dueDate: "2024-11-30",
    createDate: "2024-10-15",
    subjectName: "Art",
    teacherName: "Mr. Green",
    teacherImg: teacher,
    subjectPic: "https://img.youtube.com/vi/UClOQrZIZQZojI3CmJ3jC2eg/0.jpg",
    description: "Create a painting inspired by Van Gogh.",
    assignments: [],
  },
  {
    id: 6,
    dueDate: "2024-12-01",
    createDate: "2024-10-18",
    subjectName: "Geography",
    teacherName: "Ms. White",
    teacherImg: teacher,
    subjectPic: "https://img.youtube.com/vi/UClOQrZIZQZojI3CmJ3jC2eg/0.jpg",
    description: "Map out the countries of Europe.",
    assignments: [],
  },
  {
    id: 7,
    dueDate: "2024-12-05",
    createDate: "2024-10-20",
    subjectName: "Physics",
    teacherName: "Dr. Black",
    teacherImg: teacher,
    subjectPic: "https://img.youtube.com/vi/UClOQrZIZQZojI3CmJ3jC2eg/0.jpg",
    description: "Complete the lab report on Newton's laws.",
    assignments: [],
  },
  {
    id: 8,
    dueDate: "2024-12-10",
    createDate: "2024-10-25",
    subjectName: "Chemistry",
    teacherName: "Ms. Blue",
    teacherImg: teacher,
    subjectPic: "https://img.youtube.com/vi/UClOQrZIZQZojI3CmJ3jC2eg/0.jpg",
    description: "Experiment with acids and bases.",
    assignments: [],
  },
  {
    id: 9,
    dueDate: "2024-12-15",
    createDate: "2024-10-28",
    subjectName: "Computer Science",
    teacherName: "Mr. Grey",
    teacherImg: teacher,
    subjectPic: "https://img.youtube.com/vi/UClOQrZIZQZojI3CmJ3jC2eg/0.jpg",
    description: "Develop a simple website using HTML and CSS.",
    assignments: [],
  },
  {
    id: 10,
    dueDate: "2024-12-20",
    createDate: "2024-10-30",
    subjectName: "Physical Education",
    teacherName: "Ms. Pink",
    teacherImg: teacher,
    subjectPic:
      "https://cdn.hashnode.com/res/hashnode/image/upload/v1682619527416/170f2bcc-ad89-4885-9a64-105d4529a314.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp",
    description: "Prepare for the upcoming sports day events.",
    assignments: [],
  },
];

const AssignmentSections = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {data.map((assignment) => (
        <div
          key={assignment.id}
          className="relative h-auto rounded-lg bg-white flex flex-col space-y-2 p-2 cursor-pointer overflow-hidden"
        >
          <div className="relative">
            <img
              className="h-20 w-full object-cover rounded-lg"
              src={assignment.subjectPic}
              alt={`${assignment.subjectName} image`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-start justify-center rounded-lg p-2">
              <p className="text-white text-lg font-bold">
                {assignment.subjectName}
              </p>
              <p className="text-white">{assignment.teacherName}</p>
            </div>
          </div>
          <div className="absolute right-2 top-14 bg-white rounded-full p-1 shadow">
            <img
              className="h-14 w-14 rounded-full object-cover"
              src={assignment.teacherImg || teacher}
              alt={assignment.teacherName}
            />
          </div>
          <div className=" p-2 break-words flex-grow max-w-52">
            <h1 className="text-sm md:text-base lg:text-md">
              {assignment.description}
            </h1>
            <p className="text-green-500 text-sm font-semibold">
              Assign:{"  "}
              <span>{assignment.createDate}</span> ---{" "}
              <span> Due: {assignment.dueDate}</span>
            </p>
          </div>
          <div className="border-t-2 flex justify-end items-center p-1">
            <button className="rounded-full p-1 bg-blue-500 text-white hover:bg-blue-600 transition">
              <Maximize2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentSections;

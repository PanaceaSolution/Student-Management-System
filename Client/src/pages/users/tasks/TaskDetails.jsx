const assignment = {
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
   assignments: [
      {
         id: "1",
         title: "Write a C program for finding factorial",
      },
      {
         id: "2",
         title: "Create a flowchart for sorting algorithms",
      },
      {
         id: "3",
         title: "Research and write a report on calculus",
      },
      {
         id: "4",
         title: "Solve problems from chapter 5 of the textbook",
      },
      {
         id: "5",
         title: "Prepare a presentation on the Pythagorean theorem",
      },
      {
         id: "2",
         title: "Create a flowchart for sorting algorithms",
      },
   ],
};

const TaskDetails = () => {
   return (
      <section className="w-full p-2 mx-auto">
         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-2">
            <div className="h-auto rounded-lg bg-white lg:col-span-3">
               <div className="relative">
                  <img
                     className="h-48 w-full object-cover rounded-lg"
                     src={assignment.subjectPic}
                     alt={`${assignment.subjectName} image`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg p-2">
                     <p className="text-white text-5xl font-semibold">
                        {assignment.subjectName}
                     </p>
                  </div>
               </div>
            </div>

            <div className="relative h-auto border-2 bg-white  overflow-y-auto">
               <h2 className="sticky top-0  font-bold mb-2 py-2 text-center text-2xl shadow-md bg-green-600 text-white">
                  Assignments
               </h2>
               <ol className="list-disc list-inside break-words flex flex-col space-y-5 px-4">
                  {assignment.assignments.map((assign) => (
                     <li
                        type="1"
                        className="font-semibold hover:bg-blue-500 p-2 rounded-sm cursor-pointer transition duration-200 ease-in-out"
                        key={assign.id}
                     >
                        {assign.title}
                     </li>
                  ))}
               </ol>
            </div>

            {/* <div className="relative h-auto border-2 bg-white p-1 lg:col-span-2">
               <div className="sticky top-0 flex items-center gap-4 bg-gray-100 p-2">
                  <div className="flex justify-center items-center gap-2">
                     {" "}
                     <img
                        className="w-12 h-12 rounded-full"
                        src={assignment.teacherImg}
                        alt=""
                     />
                     <div className="font-medium dark:text-white">
                        <div>Jese Leos</div>
                        <div className="text-sm ">August 2014</div>
                     </div>
                  </div>
               </div>
               <div className="p-2">
                  <span>{assignment.assignments[0].title}</span>
                  <img
                     className="h-52 w-48 object-cover mt-2"
                     src={assignment.teacherImg}
                     alt=""
                  />
               </div>
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                     <div
                        key={index}
                        className="h-24 rounded-sm bg-gray-200 p-2 flex gap-2 justify-evenly items-center cursor-pointer"
                     >
                        <img
                           className="h-20 w-auto object-cover"
                           src={assignment.teacherImg}
                           alt={`${assignment.teacherName} profile picture`}
                        />
                        <p className="font-semibold border-l-2 pl-2">
                           Software Engineering
                        </p>
                     </div>
                  ))}
               </div>
            </div> */}
            <div className="relative h-auto border-2 bg-white p-1 lg:col-span-2">

            </div>
         </div>
      </section>
   )
}

export default TaskDetails
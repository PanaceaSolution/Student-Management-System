
import AssignmentCard from '@/pages/Assignment/AssignmentCard'
import teacher from "../../../assets/suk.jpg";

const data = [
   {
      id: 1,
      dueDate: "2024-11-15",
      createDate: "2024-10-01",
      subjectName: "Mathematics",
      teacherName: "Mr. Smith",
      teacherImg: "https://images.unsplash.com/photo-1597570889212-97f48e632dad?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      teacherImg: "https://images.unsplash.com/photo-1584554376766-ac0f2c65e949?q=80&w=1927&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      teacherImg: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      teacherImg: "https://images.unsplash.com/photo-1700156246325-65bbb9e1dc0d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subjectPic:
         "https://miro.medium.com/v2/resize:fit:1200/1*VTW6T-7KkQHPjf4mtfQ0Zg.png",
      description: "Read 'To Kill a Mockingbird' and write a summary.",
      assignments: [],
   },
   {
      id: 5,
      dueDate: "2024-11-30",
      createDate: "2024-10-15",
      subjectName: "Art",
      teacherName: "Mr. Green",
      teacherImg: "https://images.unsplash.com/photo-1570338652597-a6a2b7bcaf1b?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      subjectPic: "https://k2bindia.com/wp-content/uploads/2015/08/React.png",
      description: "Create a painting inspired by Van Gogh.",
      assignments: [],
   }
];

const Tasks = () => {
   return (
      <section className="max-w-full mx-auto p-2">
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {data.map((assignment) => (
               <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
         </div>
      </section>
   )
}

export default Tasks
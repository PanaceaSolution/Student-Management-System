import PortfolioCard from '@/components/portfolioCard'
import StudentResult from '@/components/studentResult'
import useAuthStore from '@/store/authStore'
import useUserStore from '@/store/userStore';
import { useEffect } from 'react';

const assignment = [
   { class: "4", subject: "English", onTime: "Yes", date: "2023/02/20" },
   { class: "4", subject: "Nepali", onTime: "Yes", date: "2023/02/22" },
   { class: "4", subject: "Mathematics", onTime: "No", date: "2023/02/24" },
   { class: "4", subject: "Science", onTime: "Yes", date: "2023/02/26" },
   { class: "4", subject: "Computer", onTime: "Yes", date: "2023/03/01" }
];

const examResult = [
   { class: "4", subject: "English", marks: "86", date: "2023/03/20" },
   { class: "4", subject: "Nepali", marks: "81", date: "2023/03/21" },
   { class: "4", subject: "Mathematics", marks: "89", date: "2023/03/22" },
   { class: "4", subject: "Science", marks: "75", date: "2023/03/23" },
   { class: "4", subject: "Computer", marks: "79", date: "2023/03/24" }
];

const Portfolio = () => {
   const { loggedInUser } = useAuthStore()
   const role = loggedInUser?.role
   const { userById, getUserById } = useUserStore()

   useEffect(() => {
      const fetchUser = async () => {
         await getUserById(loggedInUser.id)
      }

      fetchUser()
   }, [])
   console.log(userById);

   const info = [
      { name: "First Name", value: userById?.profile_fname, },
      { name: "Last Name", value: userById?.profile_lname, },
      { name: "Father's Name", value: userById?.fatherName, },
      { name: "Mother's Name", value: "Jessy Doe", },
      { name: "Gender", value: "Male", },
      { name: "Date of Birth", value: "2020/05/10", },
      { name: "Blood Type", value: "A+", },
      { name: "Email", value: "LmV0z@example.com", },
      { name: "Admission Date", value: "2023/01/20", },
      { name: "Class", value: "4", },
      { name: "Section", value: "A", },
      { name: "Address", value: "Lalitpur", }
   ]

   return (
      <section className="w-full mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:p-4 h-full">
            <div className="col-span-3 h-full">
               <PortfolioCard info={info} role={role} />
            </div>

            {role === "STUDENT" &&
               <div className="col-span-2 border space-y-4 h-full flex flex-col">
                  <StudentResult
                     title="Assignment"
                     result={assignment}
                  />
                  <StudentResult
                     title="Exam Result"
                     result={examResult}
                  />
               </div>
            }
         </div>
      </section>
   )
}

export default Portfolio

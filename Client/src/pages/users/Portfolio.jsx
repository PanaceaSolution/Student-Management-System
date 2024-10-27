import PortfolioCard from '@/components/portfolioCard'
import StudentResult from '@/components/studentResult'
import useAuthStore from '@/store/authStore'


const info = ["John Doe", "John Doe", "John Doe", "Male", "2020/05/10", "A+", "LmV0z@example.com", "2023/01/20", "1", "A", "Lalitpur"]

const assignment = [
   { class: "1", subject: "English", onTime: "Yes", date: "2023/01/20" },
   { class: "1", subject: "Nepali", onTime: "Yes", date: "2023/01/22" },
   { class: "1", subject: "Mathematics", onTime: "No", date: "2023/01/24" },
   { class: "1", subject: "Science", onTime: "Yes", date: "2023/01/26" }
];

const examResult = [
   { class: "1", subject: "English", marks: "85", date: "2023/01/20" },
   { class: "1", subject: "Nepali", marks: "80", date: "2023/01/22" },
   { class: "1", subject: "Mathematics", marks: "90", date: "2023/01/24" },
   { class: "1", subject: "Science", marks: "70", date: "2023/01/26" }
];

const Portfolio = () => {
   const { loggedInUser } = useAuthStore()
   const role = loggedInUser?.role
   return (
      <section className="w-full mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
            <div className="col-span-3">
               <PortfolioCard info={info} />
            </div>

            {role === "STUDENT" &&
               <div className="col-span-2 border space-y-4">
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
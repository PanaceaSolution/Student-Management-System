import React from 'react'

const ActiveTab = ({ activeTab, handleTabClick, filteredStaff }) => {
   return (
      <div className="bg-[#F8F8F8] flex gap-6 justify-start items-center p-4 border-b-2">
         {["all", "present", "alumni"].map((tab) => (
            <div key={tab}>
               <a
                  href="#"
                  className={`font-semibold cursor-pointer ${activeTab === tab ? "border-b-2 border-blue-600" : "text-gray-500"
                     }`}
                  onClick={() => handleTabClick(tab)}
               >
                  {tab.toUpperCase()}{" "}
                  <span
                     className={`text-primary bg-gray-200 px-1 rounded ${activeTab === tab ? "" : ""}`}
                  >
                     {filteredStaff.length}
                  </span>
               </a>
            </div>
         ))}
      </div>
   )
}

export default ActiveTab
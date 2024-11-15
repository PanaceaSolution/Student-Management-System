import React from "react";
import Info from "./Info";
import { RefreshCcw, X } from "lucide-react";
import Notice from "./Notice";
import RecentActivity from "./RecentActivity";
import EventCalender from "./EventCalender";
import ExpenseChart from "./ExpenseChart";
import InfoChart from "./InfoChart";
const Dashboard = () => {
  
  return (
    <section className="max-w-full flex flex-col p-2 md:p-2 h-screen overflow-y-auto scrollbar-none space-y-4">
      <div>
        <Info />
      </div>
      {/* expense */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="h-fill  bg-white p-2">
          <ExpenseChart />
        </div>
        <div className="h-full  bg-white p-2">
         
          <InfoChart />
        </div>
      </div>
      {/* Calendar sections */}
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-8">
        <div className="relative h-96 lg:col-span-2 bg-white ">

          <div className="flex  sticky top-0 justify-between px-4 p-2 border-b-2 ">
            <p className="text-lg text-black font-semibold">Event Calender</p>
            <div className="flex space-x-2 cursor-pointer">
              <RefreshCcw size={20} className="text-green-600" />

              <X size={20} className="text-red-700" />
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin">
            <EventCalender />
          </div>
        </div>

        <div className="relative h-96 bg-white ">
          <div className="flex  justify-between px-4 p-2 border-b-2 ">
            <p className="text-lg text-black font-semibold">Notice Board</p>
            <div className="flex space-x-2 cursor-pointer">
              <RefreshCcw size={20} className="text-green-600" />
              <X size={20} className="text-red-700" />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin">
            <Notice />
          </div>
        </div>

        <div className="relative h-96 bg-white ">
          <div className="flex   justify-between px-4 p-2 border-b-2 ">
            <p className="text-lg text-black font-semibold">
              Recent Activities
            </p>
            <div className="flex space-x-2 cursor-pointer">
              <RefreshCcw size={20} className="text-green-600" />
              <X size={20} className="text-red-700" />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin">
            <RecentActivity />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

import React from "react";
import Info from "./Info";
import Notice from "./Notice";
import RecentActivity from "./RecentActivity";
import EventCalender from "./EventCalender";
import ExpenseChart from "./ExpenseChart";
import InfoChart from "./InfoChart";
import useAuthStore from "@/store/authStore";

const Dashboard = () => {
  const { loggedInUser } = useAuthStore();
  const role = loggedInUser?.role;

  return (
    <section className="space-y-4">
      {/* Info Section */}
      <Info />

      {/* Calendar and Notice Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        {/* Event Calendar */}
        <EventCalender />
        {/* Notice Section */}
        <Notice />
      </div>

      {/* Charts Section (Admin Only) */}
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <ExpenseChart />
          <InfoChart />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
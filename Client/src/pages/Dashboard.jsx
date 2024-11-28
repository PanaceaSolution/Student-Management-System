import React, { useEffect } from "react";
import Info from "../components/admin/AdminDashboard/Info";
import EventCalender from "../components/admin/AdminDashboard/EventCalender";
import ExpenseChart from "../components/admin/AdminDashboard/ExpenseChart";
import InfoChart from "../components/admin/AdminDashboard/InfoChart";
import useAuthStore from "@/store/authStore";
import Notice from "@/components/admin/AdminDashboard/Notice";
import useUserStore from "@/store/userStore";

const Dashboard = () => {
  const { loggedInUser } = useAuthStore();
  const role = loggedInUser?.role;

  const { stats, getStats } = useUserStore();
  useEffect(() => {
    const fetchStats = async () => {
      await getStats();
    };
    fetchStats();
  }, [])

  return (
    <section className="space-y-4">
      <Info stats={stats} />

      {/* Calendar and Notice Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        <EventCalender />
        <Notice role={role} />
      </div>

      {/* Charts Section (Admin Only) */}
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <ExpenseChart />
          <InfoChart stats={stats} />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
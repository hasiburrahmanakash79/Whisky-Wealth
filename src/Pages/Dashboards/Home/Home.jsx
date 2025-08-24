// src/components/Home.jsx
import { useState, useEffect } from "react";

import DashboardCard from "./DashboardCard";
import GrowthOverviewChart from "./GrowthOverviewChart";
import UserActivityChart from "./UserActivityChart";
import RecentUser from "./RecentUser";
import apiClient from "../../../lib/api-client";
import Loader from "../../../components/Common/Loader";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/admin/dashboard");
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          throw new Error("API request failed");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen justify-center items-center text-center py-10">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <DashboardCard data={dashboardData} />
      <div className="py-10 grid grid-cols-3 gap-7">
        <div className="col-span-2">
          <GrowthOverviewChart data={dashboardData} />
        </div>
        <div className="col-span-1">
          <UserActivityChart data={dashboardData} />
        </div>
      </div>
      <RecentUser data={dashboardData} />
    </div>
  );
};

export default Home;

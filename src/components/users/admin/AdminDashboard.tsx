import { useState, useEffect } from "react";
import api from "@/api/api"; // Adjust the import path as necessary
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminDashboardProps {
  setActive: (active: string) => void;
}

function AdminDashboard({ setActive }: AdminDashboardProps) {
  const [data, setData] = useState({
    issues: { issues: [] },
    users: { data: [] },
    notifications: { notifications: [] },
    comments: { comments: [] },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const issuesResponse = await api.get("/issue");
        const usersResponse = await api.get("/user");
        const notificationsResponse = await api.get("/notification");
        const commentsResponse = await api.get("/comment");

        setData({
          issues: issuesResponse.data || [],
          users: usersResponse.data || [],
          notifications: notificationsResponse.data || [],
          comments: commentsResponse.data || { comments: [] },
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);

  console.log('data of the admin', data);

  const combinedChartData = [
    { name: "Issues", value: data?.issues?.issues?.length, color: "#FF6347" },
    { name: "Users", value: data?.users?.data?.length, color: "#4682B4" },
    {
      name: "Notifications",
      value: data?.notifications?.notifications?.length,
      color: "#32CD32",
    },
    {
      name: "Comments",
      value: data?.comments?.comments?.length,
      color: "#FFD700",
    },
  ];

  return (
    <div className="p-4 flex flex-wrap gap-6">
      {/* Clickable cards for each category */}
      <div className="flex flex-wrap justify-center items-center gap-6 w-full">
        <div
          className="bg-white p-4 shadow hover:bg-gray-100 w-[200px] rounded-xl flex flex-col items-center justify-center py-2 cursor-pointer"
          onClick={() => setActive("Issues")}
        >
          <h3 className="mb-4 font-bold text-2xl">Issues</h3>
          <h1 className="text-3xl text-red-500 font-semibold">
            {data?.issues?.issues?.length}
          </h1>
        </div>

        <div
          className="bg-white p-4 shadow hover:bg-gray-100 w-[200px] rounded-xl flex flex-col items-center justify-center py-2 cursor-pointer"
          onClick={() => setActive("Users")}
        >
          <h3 className="mb-4 font-bold text-2xl">Users</h3>
          <h1 className="text-3xl text-blue-500 font-semibold">
            {data?.users?.data?.length}
          </h1>
        </div>

        <div
          className="bg-white p-4 shadow hover:bg-gray-100 w-[200px] rounded-xl flex flex-col items-center justify-center py-2 cursor-pointer"
          onClick={() => setActive("Notifications")}
        >
          <h3 className="mb-4 font-bold text-2xl">Notifications</h3>
          <h1 className="text-3xl text-green-500 font-semibold">
            {data?.notifications?.notifications?.length}
          </h1>
        </div>

        <div
          className="bg-white p-4 shadow hover:bg-gray-100 w-[200px] rounded-xl flex flex-col items-center justify-center py-2 cursor-pointer"
          onClick={() => setActive("Comments")}
        >
          <h3 className="mb-4 font-bold text-2xl">Comments</h3>
          <h1 className="text-3xl text-yellow-500 font-semibold">
            {data?.comments?.comments?.length}
          </h1>
        </div>
      </div>

      {/* Chart Rendering */}
      <div className="w-full mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={combinedChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;

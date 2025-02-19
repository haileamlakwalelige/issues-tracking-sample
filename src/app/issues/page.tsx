// pages/index.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/api/api";

interface Assignee {
  name: string;
}

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  assignee: Assignee;
}

const Page = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.get("/issue"); // Update with your actual API endpoint
        setIssues(response.data.issues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("issues", issues);

  return (
    <div className="container mx-auto p-4 min-h-[90vh]">
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Assignee</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Priority</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td className="border border-gray-300 p-2">{issue.id}</td>
              <td className="border border-gray-300 p-2">{issue.title}</td>
              <td className="border border-gray-300 p-2">
                {issue.assignee.name}
              </td>
              <td className="border border-gray-300 p-2">{issue.status}</td>
              <td className="border border-gray-300 p-2">{issue.priority}</td>
              <td className="border border-gray-300 p-2">
                <Link
                  href={`/issues/${issue.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;

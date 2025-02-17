import React, { useEffect, useState } from "react";
import api from "@/api/api";
import CreateIssueForm from "@/components/reusalbe/CreateIssueForm";

// Define the shape of an Issue
interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  file: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  priority: string;
  assignee: {
    username: string;
  };
}

function IssuesTable() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const categories = ["Bug", "Feature", "Improvement", "Task"];
  const statuses = ["TODO", "IN PROGRESS", "COMPLETED"];
  const priorities = ["LOW", "MEDIUM", "HIGHT"];

  // Fetch issues from the API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issuesResponse = await api.get("/issue");
        setIssues(issuesResponse.data.issues); // Assuming the API returns an array under 'issues'
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []); // Empty array ensures this only runs on component mount

  // Function to handle delete
  const handleDelete = (id: number) => {
    setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
    // Optionally, send a DELETE request to the server
    api
      .delete(`/issue/${id}`)
      .catch((error) => console.error("Error deleting issue:", error));
  };

  // Function to handle edit
  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setIsEditModalOpen(true);
  };

  // Function to handle saving the edited issue
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIssue) {
      api
        .put(`/issue/${editingIssue.id}`, editingIssue)
        .then(() => {
          // Update the state with the updated issue
          setIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue.id === editingIssue.id ? editingIssue : issue
            )
          );
          setIsEditModalOpen(false); // Close the modal
        })
        .catch((error) => console.error("Error updating issue:", error));
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  return (
    <div>
      {/* Create Issue Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Issue
      </button>

      {/* Create Issue Form Modal */}
      {isCreateModalOpen && <CreateIssueForm onClose={handleCloseModal} />}

      {/* Edit Issue Form Modal */}
      {isEditModalOpen && editingIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Issue</h2>
            <form onSubmit={handleSaveEdit}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={editingIssue.title}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={editingIssue.description}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <select
                  value={editingIssue.category}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* File */}
              <div className="mb-4">
                <label className="block text-gray-700">File</label>
                <input
                  type="text"
                  value={editingIssue.file}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  value={editingIssue.status}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      status: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="mb-4">
                <label className="block text-gray-700">Priority</label>
                <select
                  value={editingIssue.priority}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      priority: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issues Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Assignee</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Priority</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td className="px-4 py-2 border">{issue.title}</td>
              <td className="px-4 py-2 border">{issue.description}</td>
              <td className="px-4 py-2 border">{issue.assignee.username}</td>
              <td className="px-4 py-2 border">{issue.category}</td>
              <td className="px-4 py-2 border">{issue.status}</td>
              <td className="px-4 py-2 border">{issue.priority}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(issue)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(issue.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IssuesTable;

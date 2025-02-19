import React, { useEffect, useState } from "react";
import api from "@/api/api";
import CreateIssueForm from "@/components/users/admin/CreateIssueForm";
import { HiDotsVertical } from "react-icons/hi";
import { useSession } from "next-auth/react";

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
  deadline: string;
  assignee: {
    username: string;
  };
}

function MyIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const { data: session } = useSession();

  const categories = ["Bug", "Feature", "Improvement", "Task"];
  const statuses = ["TODO", "IN PROGRESS", "COMPLETED"];
  const priorities = ["LOW", "MEDIUM", "HIGH"];

  // Fetch issues from the API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issuesResponse = await api.get("/issue");
        setIssues(issuesResponse.data.issues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

  // Function to handle delete
  const handleDelete = (id: number) => {
    setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
    api.delete(`/issue/${id}`).catch((error) => console.error("Error deleting issue:", error));
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
      api.put(`/issue/${editingIssue.id}`, editingIssue)
        .then(() => {
          setIssues((prevIssues) =>
            prevIssues.map((issue) => (issue.id === editingIssue.id ? editingIssue : issue))
          );
          setIsEditModalOpen(false);
        })
        .catch((error) => console.error("Error updating issue:", error));
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Drag-and-drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    const id = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const updatedIssues = issues.map((issue) => {
      if (issue.id === id) {
        return { ...issue, status: newStatus };
      }
      return issue;
    });

    // Update the state with the new status
    setIssues(updatedIssues);

    // Prepare data for PUT request
    const issueToUpdate = updatedIssues.find((issue) => issue.id === id);
    if (issueToUpdate) {
      const requestData = {
        id: issueToUpdate.id.toString(),
        title: issueToUpdate.title,
        description: issueToUpdate.description,
        status: newStatus,
        category: issueToUpdate.category,
        priority: issueToUpdate.priority,
        deadline: issueToUpdate.deadline,
        file: issueToUpdate.file,
        fileType: issueToUpdate.fileType,
      };

      // Send a PUT request to update the issue status on the server
      api.put(`http://localhost:3000/api/issue/${id}`, requestData)
        .catch((error) => console.error("Error updating issue status:", error));
    }
  };

  // Filter issues assigned to the logged-in user
  const myIssues = issues.filter(
    (issue) => issue.assignee.username === session?.user?.username
  );

  // Categorize issues by status
  const categorizedIssues = (status: string) =>
    myIssues.filter((issue) => issue.status === status);

  return (
    <div>
      {/* Create Issue Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 cursor-pointer"
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

              {/* Deadline */}
              <div className="mb-4">
                <label className="block text-gray-700">Deadline</label>
                <input
                  type="date"
                  value={editingIssue.deadline}
                  onChange={(e) =>
                    setEditingIssue({
                      ...editingIssue,
                      deadline: e.target.value,
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

      {/* Kanban Board */}
      <div className="flex space-x-4">
        {statuses.map((status) => (
          <div
            key={status}
            className="border rounded p-4 w-1/3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = parseInt(e.dataTransfer.getData("text/plain"), 10);
              handleDrop(e, status); // New status is passed here
            }}
          >
            <h2 className="text-lg font-bold mb-2 border-b-2 border-red-500">
              {status}
            </h2>
            {categorizedIssues(status).map((issue) => (
              <div
                key={issue.id}
                draggable
                onDragStart={(e) => handleDragStart(e, issue.id)}
                className="bg-gray-100 p-2 mb-2 rounded shadow"
              >
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{issue.title}</h3>
                    <p className="text-sm">{issue.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-row space-y-2 items-end justify-end bg-white w-fit">
                      <button
                        onClick={() => handleEdit(issue)}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyIssues;
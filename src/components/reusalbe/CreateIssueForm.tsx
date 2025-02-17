import React, { useState, useEffect } from "react";
import api from "@/api/api";

// Define the shape of the form data
interface CreateIssueFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  file: File | null;
  fileType: string;
  assignee: string[];
  status: string;  // New status field
}

interface User {
  id: string;
  name: string;
}

const CreateIssueForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<CreateIssueFormData>({
    title: "",
    description: "",
    category: "",
    priority: "",
    file: null,
    fileType: "",
    assignee: [],
    status: "",  // Default empty string for status
  });

  const categories = ["Bug", "Feature", "Improvement", "Task"];
  const priorities = ["LOW", "MEDIUM", "HIGH"];
  const statuses = ["TODO", "IN PROGRESS", "COMPLETED"];  // Add possible statuses

  const [users, setUsers] = useState<any[]>([]); // To store list of users (with their ids)

  // Fetch list of users (you may adjust the API URL)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  console.log("users", users);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;

    if (type === "file") {
      setFormData({ ...formData, file: files ? files[0] : null });
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, assignee: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("priority", formData.priority);
    data.append("status", formData.status);  // Append status to the data
    data.append("file", formData.file as Blob);
    data.append("fileType", formData.fileType);
    formData.assignee.forEach((id) => data.append("assignee[]", id));

    try {
      await api.post("/issue", data); // Send data to the API
      alert("Issue created successfully");
      onClose(); // Close the form after submitting
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-full sm:w-96 md:w-1/2 lg:w-1/3 max-h-screen overflow-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create New Issue
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-700">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Priority</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* File */}
          <div>
            <label className="block text-gray-700">Attach File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Type */}
          <div>
            <label className="block text-gray-700">File Type</label>
            <select
              name="fileType"
              value={formData.fileType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select File Type</option>
              <option value="Document">Document</option>
              <option value="Image">Image</option>
              <option value="Spreadsheet">Spreadsheet</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-gray-700">Assign Users</label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              // multiple
            >
              <option value="">Select User</option>
              {users.map((user: User) => (
                <option className="w-fit" key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Issue
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssueForm;

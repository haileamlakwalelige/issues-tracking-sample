import React, { useEffect, useState } from "react";
import api from "@/api/api";

// Define the shape of a User
interface User {
  id: number;
  email: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await api.get("/user");  // Update endpoint to fetch users
        setUsers(usersResponse.data.data);  // Assuming the API returns an array under 'users'
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Empty array ensures this only runs on component mount

  // Function to handle delete
  const handleDelete = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    // Optionally, send a DELETE request to the server
    api
      .delete(`/user/${id}`)  // Update to the correct endpoint for user
      .catch((error) => console.error("Error deleting user:", error));
  };

  // Function to handle edit
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // Function to handle saving the edited user
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      api
        .put(`/user/${editingUser.id}`, editingUser)  // Update to the correct endpoint for user
        .then(() => {
          // Update the state with the updated user
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === editingUser.id ? editingUser : user
            )
          );
          setIsEditModalOpen(false); // Close the modal
        })
        .catch((error) => console.error("Error updating user:", error));
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  console.log("users", users);

  return (
    <div>
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleSaveEdit}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      username: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <input
                  type="text"
                  value={editingUser.role}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded"
                />
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

      {/* Users Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Username</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.username}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
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

export default UserTable;

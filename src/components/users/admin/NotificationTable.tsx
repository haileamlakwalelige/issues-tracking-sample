import React, { useEffect, useState } from "react";
import api from "@/api/api";

// Define the shape of a Notification and Recipient
interface Recipient {
  id: number;
  email: string;
  name: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: number;
  message: string;
  recipientId: number;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  recipient: Recipient; // Embedded recipient object
}

function NotificationTable() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notification"); // Replace with the correct API endpoint for notifications
        setNotifications(response.data.notifications); // Assuming the API returns notifications under 'data'
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []); // Empty array ensures this only runs on component mount

  // Function to handle delete
  const handleDelete = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    // Optionally, send a DELETE request to the server
    api
      .delete(`/notification/${id}`) // Update to the correct endpoint for notification
      .catch((error) => console.error("Error deleting notification:", error));
  };

  // Function to handle edit
  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    setIsEditModalOpen(true);
  };

  // Function to handle saving the edited notification
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotification) {
      api
        .put(`/notification/${editingNotification.id}`, editingNotification) // Update to the correct endpoint for notification
        .then(() => {
          // Update the state with the updated notification
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.id === editingNotification.id ? editingNotification : notification
            )
          );
          setIsEditModalOpen(false); // Close the modal
        })
        .catch((error) => console.error("Error updating notification:", error));
    }
  };

  // Function to handle marking as read
  const handleMarkAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    // Optionally, send a PUT request to the server to mark it as read
    api
      .put(`/notification/${id}`, { read: true })
      .catch((error) => console.error("Error marking notification as read:", error));
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  console.log("notifications", notifications);

  return (
    <div>
      {isEditModalOpen && editingNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Notification</h2>
            <form onSubmit={handleSaveEdit}>
              {/* Message */}
              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <input
                  type="text"
                  value={editingNotification.message}
                  onChange={(e) =>
                    setEditingNotification({
                      ...editingNotification,
                      message: e.target.value,
                    })
                  }
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

      {/* Notifications Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Recipient Name</th>
            <th className="px-4 py-2 border">Message</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td className="px-4 py-2 border">{notification.recipient.name}</td>
              <td className="px-4 py-2 border">{notification.message}</td>
              <td className="px-4 py-2 border">
                {notification.read ? "Read" : "Unread"}
              </td>
              <td className="px-4 py-2 border">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => handleEdit(notification)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(notification.id)}
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

export default NotificationTable;

import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { useSession } from "next-auth/react";

// Define the shape of a Comment
interface Comment {
  id: number;
  content: string;
  file: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
  };
}

function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const { data: session } = useSession();

  // Fetch comments from the API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get("/comment"); // Replace with the correct API endpoint for comments
        setComments(response.data.comments); // Assuming the API returns comments under 'data'
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []); // Empty array ensures this only runs on component mount

  // Function to handle delete
  const handleDelete = (id: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
    // Optionally, send a DELETE request to the server
    api
      .delete(`/comment/${id}`) // Update to the correct endpoint for comment
      .catch((error) => console.error("Error deleting comment:", error));
  };

  // Function to handle edit
  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setIsEditModalOpen(true);
  };

  // Function to handle saving the edited comment
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComment) {
      api
        .put(`/comment/${editingComment.id}`, editingComment) // Update to the correct endpoint for comment
        .then(() => {
          // Update the state with the updated comment
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === editingComment.id ? editingComment : comment
            )
          );
          setIsEditModalOpen(false); // Close the modal
        })
        .catch((error) => console.error("Error updating comment:", error));
    }
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  
  const myComments = comments.filter(
    (issue) => issue.author.username === session?.user?.username
  );
  console.log("comments", comments);
  console.log("Mycomments", myComments);
  return (
    <div>
      <h1 className="font-bold text-3xl mb-6">
        My Comments
      </h1>
      {isEditModalOpen && editingComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Comment</h2>
            <form onSubmit={handleSaveEdit}>
              {/* Content */}
              <div className="mb-4">
                <label className="block text-gray-700">Content</label>
                <textarea
                  value={editingComment.content}
                  onChange={(e) =>
                    setEditingComment({
                      ...editingComment,
                      content: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {/* File Preview */}
              <div className="mb-4">
                {editingComment.file && (
                  <div>
                    <label className="block text-gray-700">Attached File</label>
                    <div className="mt-2">
                      {editingComment.fileType.startsWith("image") ? (
                        <img
                          src={editingComment.file}
                          alt="File Preview"
                          className="max-w-full h-auto rounded"
                        />
                      ) : (
                        <a href={editingComment.file} className="text-blue-500">
                          View or Download File
                        </a>
                      )}
                    </div>
                  </div>
                )}
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

      {/* Comments Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Content</th>
            <th className="px-4 py-2 border">File</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {myComments.map((comment) => (
            <tr key={comment.id}>
              <td className="px-4 py-2 border">{comment.content}</td>
              <td className="px-4 py-2 border">
                {comment.file && (
                  <a href={comment.file} className="text-blue-500">
                    View or Download File
                  </a>
                )}
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(comment)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
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

export default Comments;

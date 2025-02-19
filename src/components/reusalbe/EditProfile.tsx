import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import api from "@/api/api"; // Assuming api is configured to use axios
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Description } from "@radix-ui/react-toast";

// Define types for the session and form data
interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
}

interface Session {
  user: User;
}

interface FormData {
  name: string;
  username: string;
  email: string;
}

const EditProfile: React.FC = () => {
  const { data: session, update: updateSession } = useSession() as {
    data: Session | null;
    update: (data: any) => void;
  };
  const router = useRouter(); // Initialize the router

  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        username: session.user.username || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle saving the edited user
  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (session?.user) {
      const updatedData = {
        id: session.user.id,
        email: formData.email || session.user.email,
        name: formData.name || session.user.name,
        username: formData.username || session.user.username,
      };

      try {
        const response = await api.put(`/user/${session.user.id}`, updatedData);

        if (response.status === 200) {
          // Update session data if there are changes
          if (
            updatedData.email !== session.user.email ||
            updatedData.name !== session.user.name ||
            updatedData.username !== session.user.username
          ) {
            // Update the session with new data
            updateSession({ user: { ...session.user, ...updatedData } });
          }
          toast({
            title: "Profile updated successfully!",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Profile updated successfully!",
            description: "An error occurred. Please try again."
          });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("An error occurred. Please try again.");
      }
    }

    router.push("/"); // Redirect to home page
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form onSubmit={handleSaveEdit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

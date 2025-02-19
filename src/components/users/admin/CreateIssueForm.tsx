import React, { useState, useEffect } from "react";
import api from "@/api/api";
import { useSession } from "next-auth/react";
import { Dialog } from "@radix-ui/react-dialog";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "@radix-ui/react-toast";

interface CreateIssueFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  file: File | null;
  status: string;
  deadline: string;
  assigneeId: string;
}

interface User {
  id: number;
  name: string;
}

const categories = ["Bug", "Feature", "Improvement", "Task"];
const priorities = ["LOW", "MEDIUM", "HIGH"];
const statuses = ["TODO", "IN PROGRESS", "COMPLETED"];

const CreateIssueForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<CreateIssueFormData>({
    title: "",
    description: "",
    category: categories[0],
    priority: priorities[0],
    file: null,
    assigneeId: "",
    deadline:'',
    status: statuses[0],
  });

  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/user")
      .then((response) => setUsers(response.data.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files?.[0]
          : name === "assigneeId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      await api.post("/issue", data);
      toast({
        variant: "default",
        title: "Issue added successfully",
        description: "You added a new issue",
      });
     
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error creating issue:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <div className=" max-w-4xl  flex justify-center items-center w-screen absolute shadow-2xl shadow-gray-200">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md p-4 md:p-8 rounded-xl"
      >
        <input
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          name="deadline"
          type="date"
          required
          value={formData.deadline}
          onChange={handleChange}
          placeholder="Deadline"
          className="w-full p-2 border rounded"
        />
        <select
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          name="priority"
          required
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {priorities.map((pri) => (
            <option key={pri} value={pri}>
              {pri}
            </option>
          ))}
        </select>
        <select
          name="status"
          required
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {statuses.map((stat) => (
            <option key={stat} value={stat}>
              {stat}
            </option>
          ))}
        </select>
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="assigneeId"
          required
          value={formData.assigneeId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={()=>onClose()}
            className="p-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIssueForm;

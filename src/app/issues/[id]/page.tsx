"use client";

import { useEffect, useState } from "react";
import api from "@/api/api"; // Ensure this points to your Axios setup
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MoveLeft } from "lucide-react";
import Image from "next/image";

interface Assignee {
  name: string;
}

interface Comment {
  id: number;
  content: string;
  file?: string; // Optional field for the file URL
}

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  assignee: Assignee;
  comments: Comment[];
}

const Page = () => {
  const { id } = useParams(); // Use useParams to get the ID from the URL
  const [issue, setIssue] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/issue?id=${id}`); // Update to your actual API endpoint
        setIssue(response.data.issues);
      } catch (error) {
        console.error("Error fetching issue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const singleIssue: Issue[] | undefined = issue?.filter(
    (issued: Issue) => issued.id.toString() === id
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!issue) {
    return <div>Issue not found!</div>;
  }

  const handleComments = async ({
    id,
    issue,
    event,
  }: {
    id: number;
    issue: Issue;
    event: React.MouseEvent<HTMLButtonElement>;
  }): Promise<void> => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("issueId", String(id));
    formData.append("authorId", String(id)); // Assuming authorId is same as issue ID for now; modify if necessary
    formData.append("content", comment);
    if (file) {
      formData.append("file", file); // Attach file if exists
    }

    try {
      const response = await api.post("/comment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the comments list with the new comment
      setIssue((prevIssues) =>
        prevIssues.map((i) =>
          i.id === id
            ? {
                ...i,
                comments: [...i.comments, response.data.comment], // Add the newly created comment
              }
            : i
        )
      );

      // Clear the comment and file field
      setComment("");
      setFile(null);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleMoveLeftClick = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="h-screen">
      <div
        className="border-2 border-blue-600 w-fit p-2 rounded-full m-4 cursor-pointer"
        onClick={handleMoveLeftClick} // Call the function when clicked
      >
        <MoveLeft />
      </div>
      {singleIssue?.map((issue: Issue) => (
        <div key={issue.id} className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">{issue.title}</h1>
          <p>
            <strong>Description:</strong> {issue.description}
          </p>
          <p>
            <strong>Category:</strong> {issue.category}
          </p>
          <p>
            <strong>Status:</strong> {issue.status}
          </p>
          <p>
            <strong>Priority:</strong> {issue.priority}
          </p>
          <p>
            <strong>Assignee:</strong> {issue.assignee.name}
          </p>

          <h2 className="text-xl font-semibold mt-4">Comments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {issue.comments.length > 0 ? (
              issue.comments.map((comment: Comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-300 p-2 mb-2"
                >
                  {/* {comment.file && (
                    <div className="mb-2">
                      <Image
                        src={comment?.file}
                        alt="comment attachment"
                        width={100}
                        height={100}
                        className="w-32 h-32 object-cover"
                      />
                    </div>
                  )} */}
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>

          <div>
            <form className="flex flex-col gap-2 mt-10 max-w-[300px]">
              <input
                type="text"
                value={comment} // Bind the input value to the state
                placeholder="Add Comment"
                onChange={(e) => setComment(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
                className="border border-gray-300 p-2 rounded"
              />

              <button
                type="submit"
                onClick={(event) =>
                  handleComments({ id: issue.id, issue, event })
                }
                className="bg-blue-500 text-white p-2 rounded mt-2"
              >
                Add Comment
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;

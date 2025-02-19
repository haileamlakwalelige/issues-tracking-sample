import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // Function to determine file type based on the file
  interface File {
    mimetype: string;
    // Add other properties if needed
  }

  function getFileType(file: File): string {
    // Assuming file is an object; check its properties as needed
    // For example, if using multer or similar for file uploads:
    return file.mimetype; // Use 'mimetype' property to get the file type
  }
  try {
    const newIssue = await db.issue.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        deadline: body.deadline,
        assigneeId: parseInt(body.assigneeId),
        file: body.file, // Store the file (e.g., file path or URL)
        fileType: getFileType(body.file), // Determine the file type on the server
        status: body.status || "TODO",
        priority: body.priority || "MEDIUM",
      },
    });

    return NextResponse.json(
      { issue: newIssue, message: "Issue created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating issue", error);
    return NextResponse.json(
      { issue: null, message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const issues = await db.issue.findMany({
      include: {
        assignee: true,
        comments: true,
      },
    });

    return NextResponse.json({ issues }, { status: 200 });
  } catch (error) {
    console.error("Error fetching issues", error);
    return NextResponse.json(
      { issues: null, message: (error as Error).message },
      { status: 500 }
    );
  }
}

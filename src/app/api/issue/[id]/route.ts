import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch a specific issue
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the issue by its ID
    const issue = await db.issue.findUnique({
      where: { id: parseInt(id) }, // Ensure 'id' is parsed as an integer
      include: {
        assignee: true,
        comments: true,
      },
    });

    // Check if the issue was found
    if (!issue) {
      return NextResponse.json(
        { message: "Issue not found" },
        { status: 404 }
      );
    }


    // Return the found issue
    return NextResponse.json({ issue }, { status: 200 });
  } catch (error) {
    console.error("Error fetching issue", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing issue
export async function PUT(request: Request) {
  const { id, ...body } = await request.json(); // Extract 'id' and other fields

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedIssue = await db.issue.update({
      where: { id: parseInt(id) }, // Ensure 'id' is parsed as an integer
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        assigneeId: body.assigneeId,
        file: body.file,
        fileType: body.fileType,
        status: body.status || "TODO",
        priority: body.priority || "MEDIUM",
      },
    });

    return NextResponse.json(
      { issue: updatedIssue, message: "Issue updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating issue", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific issue
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      const deletedIssue = await db.issue.delete({
        where: {
          id: parseInt(id), // Ensure the ID is an integer
        },
      });
  
      return NextResponse.json(
        { issue: deletedIssue, message: "Issue deleted successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting issue", error);
      return NextResponse.json(
        { issue: null, message: "Error deleting issue" },
        { status: 500 }
      );
    }
  }

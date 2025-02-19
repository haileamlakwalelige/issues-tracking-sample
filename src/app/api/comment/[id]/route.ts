import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch a specific comment by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const comment = await db.comment.findUnique({
      where: { id: parseInt(id) }, // Ensure 'id' is parsed as an integer
      include: {
        author: true,
        issue: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ comment }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comment", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing comment
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract the ID from the URL path (params)

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get the data from the request body
    const body = await request.json();

    // Prepare data for the update
    const updatedData: any = {};

    if (body.content) updatedData.content = body.content;
    if (body.file) updatedData.file = body.file;
    if (body.fileType) updatedData.fileType = body.fileType;
    if (body.authorId) updatedData.authorId = body.authorId;
    if (body.issueId) updatedData.issueId = body.issueId;

    // Update the comment
    const updatedComment = await db.comment.update({
      where: { id: parseInt(id) }, // Ensure 'id' is parsed as an integer
      data: updatedData,
    });

    return NextResponse.json(
      { comment: updatedComment, message: "Comment updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comment", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific comment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedComment = await db.comment.delete({
      where: {
        id: parseInt(id), // Ensure the ID is an integer
      },
    });

    return NextResponse.json(
      { comment: deletedComment, message: "Comment deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment", error);
    return NextResponse.json(
      { message: "Error deleting comment" },
      { status: 500 }
    );
  }
}

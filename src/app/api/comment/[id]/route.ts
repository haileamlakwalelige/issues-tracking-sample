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
export async function PUT(request: Request) {
  const { id, ...body } = await request.json(); // Extract 'id' and other fields

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedComment = await db.comment.update({
      where: { id: parseInt(id) }, // Ensure 'id' is parsed as an integer
      data: {
        content: body.content,
        file: body.file,
        fileType: body.fileType,
        authorId: body.authorId,
        issueId: body.issueId,
      },
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

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch a specific notification by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // Extract the query params from the URL
  const id = searchParams.get("id"); // Get the 'id' parameter from the query string

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const notification = await db.notification.findUnique({
      where: { id: parseInt(id) }, // Ensure 'id' is parsed as an integer
      include: {
        recipient: true, // Include recipient details
      },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notification", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific notification by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }
  
    try {
      const deletedComment = await db.notification.delete({
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

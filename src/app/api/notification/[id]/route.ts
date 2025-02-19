import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch a specific notification by ID and optionally update the message or read status
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
    // First, fetch the notification
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

// PUT: Update a specific notification by ID (message, read status)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract ID from the URL path (params)

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get the data from the request body
    const body = await request.json();
    const updatedData: any = {};

    // Check if the request includes a 'message' or 'read' field
    if (body.message) {
      updatedData.message = body.message; // Update the message if provided
    }

    if (body.read !== undefined) {
      updatedData.read = body.read; // Update the read status if provided
    }

    // Update the notification
    const updatedNotification = await db.notification.update({
      where: { id: parseInt(id) }, // Ensure the ID is parsed as an integer
      data: updatedData,
    });

    return NextResponse.json(
      { notification: updatedNotification },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notification", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific notification by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract ID from the URL path (params)

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedNotification = await db.notification.delete({
      where: {
        id: parseInt(id), // Ensure the ID is an integer
      },
    });

    return NextResponse.json(
      { notification: deletedNotification, message: "Notification deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notification", error);
    return NextResponse.json(
      { message: "Error deleting notification" },
      { status: 500 }
    );
  }
}

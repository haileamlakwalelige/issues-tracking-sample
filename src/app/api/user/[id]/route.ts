import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Import getServerSession
import { authOptions } from "@/lib/auth"; // Ensure you have your auth options set up

// GET: Fetch a specific user by ID
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
    const user = await db.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT: Update user data (email, name, username, role)
export async function PUT(request: Request) {
  const body = await request.json();
  const { id, email, name, username, role } = body;

  const session = await getServerSession(authOptions);
  const userIdFromSession = (session?.user as { id: string; username: string; role: string })?.id;
  const isAdmin = session?.user?.role === 'admin';

  // Input validation
  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  // Permission check: Allow update if user is admin or if user ID matches session ID
  const canUpdate = parseInt(id) === parseInt(userIdFromSession) || isAdmin;

  if (!canUpdate) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: parseInt(id) },
      data: { email, name, username, role },
    });

    return NextResponse.json(
      { user: updatedUser, message: "User updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const session = await getServerSession(authOptions); // Get the session
  const userIdFromSession = (session?.user as { id: string; username: string; role: string })?.id; // Assuming user ID is stored in session
  const isAdmin = session?.user?.role === 'admin'; // Check if user is an admin

  if (!id) {
    return NextResponse.json(
      { message: "ID is required" },
      { status: 400 }
    );
  }

  // Check permissions
  if (parseInt(id) !== parseInt(userIdFromSession) && !isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const deletedUser = await db.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      { user: deletedUser, message: "User deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
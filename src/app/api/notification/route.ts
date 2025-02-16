import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const newNotification = await db.notification.create({
      data: {
        message: body.message,
        recipientId: body.recipientId,
      },
    });

    return NextResponse.json(
      {
        notification: newNotification,
        message: "Notification created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification", error);
    return NextResponse.json(
      { notification: null, message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const notifications = await db.notification.findMany({
      include: {
        recipient: true,
      },
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications", error);
    return NextResponse.json(
      { notifications: null, message: (error as Error).message },
      { status: 500 }
    );
  }
}

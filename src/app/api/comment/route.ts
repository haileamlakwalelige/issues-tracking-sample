import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  const body = await request.json();

  try {
    // Create the comment
    const newComment = await db.comment.create({
      data: {
        content: body.content,
        file: body.file,
        fileType: body.fileType,
        authorId: body.authorId,
        issueId: body.issueId,
      },
    });

    // Find the issue to get the assignee
    const issue = await db.issue.findUnique({
      where: { id: body.issueId },
      select: { assigneeId: true },
    });

    if (issue?.assigneeId) {
      // Create a notification for the assignee
      await db.notification.create({
        data: {
          message: `New comment on your assigned issue: "${body.content}"`,
          recipientId: issue.assigneeId,
        },
      });
    }

    return NextResponse.json(
      { comment: newComment, message: "Comment created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment", error);
    return NextResponse.json(
      { comment: null, message: (error as Error).message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const comments = await db.comment.findMany({
      include: {
        author: true,
        issue: true,
      },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments", error);
    return NextResponse.json(
      { comments: null, message: (error as Error).message },
      { status: 500 }
    );
  }
}

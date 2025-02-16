import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const newComment = await db.comment.create({
      data: {
        content: body.content,
        file: body.file,
        fileType: body.fileType,
        authorId: body.authorId,
        issueId: body.issueId,
      },
    });

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

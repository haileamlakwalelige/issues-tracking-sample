import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json({
    message: "YOU get what you want",
  });
}

// define schema for input validation using zod
const userSchema = z.object({
  username: z.string().min(1, "Username is Required").max(100),
  name: z.string().min(3).max(100),
  role: z.string().min(4, "Role is Required").max(100),
  email: z.string().min(6, "Email is required").max(100),
  password: z
    .string()
    .min(1, "Password is Required")
    .min(8, "Password must be more than or equal to 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Fixed JSON parsing
    const { username, role, email, password, name } = userSchema.parse(body);

    // Check if email already exists
    const existingEmailCheck = await db.user.findUnique({
      where: { email },
    });
    if (existingEmailCheck) {
      return NextResponse.json(
        { user: null, message: "User's email is already used" },
        { status: 408 }
      );
    }

    // Check if username already exists
    const existingUsernameCheck = await db.user.findUnique({
      where: { username },
    });
    if (existingUsernameCheck) {
      return NextResponse.json(
        { user: null, message: "User's username is already used" },
        { status: 408 }
      );
    }

    // hash the password for privacy 
    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
        role, // Now just a string
        updatedAt: new Date(),
      },
    });

    // destructure to not send the password for the user
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({
      user: rest,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Error in adding user!", error);
    return NextResponse.json(
      { user: null, message: "Failed to create user" },
      { status: 500 }
    );
  }
}

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

interface Session {
  user: {
    name: string;
    email: string;
    image: string;
  };
  accessToken: string;
  username: string;
}

const Page = async () => {
  const session: Session | null = await getServerSession(authOptions);
  console.log("session data", session);

  return (
    <>
      {session?.user ? (
        <div>Welcome to {session?.username ? session.username : "Guest"}!</div>
      ) : (
        <div>Please login to get the admin page!</div>
      )}
    </>
  );
};

export default Page;

import NextAuth from "next-auth";

declare module "next-auth" {
  interface user {
    username: string;
    role: string;
  }

  interface Session {
    user: {
      username: string;
      role: string;
    }
    token: {
      username: string;
      role: string;
    };
  }
}

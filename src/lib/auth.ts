import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { db } from "./db";
import { compare } from "bcrypt";

declare module "next-auth" {
  interface User {
    username: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          return null;
        }

        if (!existingUser.password) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          username: existingUser.username || "",
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },

  callbacks: {
    // The jwt callback is invoked whenever the JWT is created or updated.
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT Callback: ", user); // Debugging
        return {
          ...token,
          username: user.username,
          role: user.role,
          id: user.id, // Include the user id
        };
      }
      return token; // Return token as-is if no user is found
    },

    // The session callback is invoked when the session is fetched on the client.
    async session({ session, token }) {
      // Add user details from token to session
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username as string, // Typecast if needed
          role: token.role as string,
          id: token.id as string, // Pass the user id to the session object
        },
      };
    },
  },
};

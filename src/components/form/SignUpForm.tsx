"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // For Next.js App Router
import Link from "next/link";
import { ToastAction } from "../ui/toast";
import { useToast } from "@/hooks/use-toast";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "username name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["admin", "developer", "reporter"], {
    message: "Role is required",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", password: "", username: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.fullName,
        email: values.email,
        username: values.username,
        role: values.role,
        password: values.password,
      }),
    });

    if (response.ok) {
      router.push("/sign-in");
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
        style={{ height: "auto" }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="p-3 border h-[45px] border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="p-3 border h-[45px] border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="username"
                      placeholder="Enter your username"
                      {...field}
                      className="p-3 border h-[45px] border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Role</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      //   defaultValue="reporter"
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none w-full text-gray-700 bg-white cursor-pointer"
                    >
                      <option>Select Role</option>

                      {/* <option
                        value="admin"
                        className="py-2 px-4 hover:bg-gray-100"
                      >
                        Admin
                      </option> */}
                      <option
                        value="developer"
                        className="py-2 px-4 hover:bg-gray-100"
                      >
                        Developer
                      </option>
                      <option
                        value="reporter"
                        className="py-2 px-4 hover:bg-gray-100"
                      >
                        Reporter
                      </option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="p-3 border h-[45px] border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Submit
            </Button>
          </form>

          <p className="text-center mt-3 font-extralight text-sm ">
            Already have an account{" "}
            <Link href={"/sign-in"} className="text-blue-700 underline">
              Sign In
            </Link>
          </p>
        </Form>
        <div className="w-full mt-5 flex items-center justify-center  gap-2">
          <Button
            onClick={() => signIn("google")}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded-xl transition-all"
          >
            <FaGoogle /> Sign Up with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded-xl transition-all"
          >
            <FaGithub /> Sign Up with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

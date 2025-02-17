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
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: sessions } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const signinData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signinData?.error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      router.refresh();
      router.push("/dashboard/admin");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-white p-6">
      {/* <h1 className="text-red-500 font-bold text-[20px]">
        {JSON.stringify(sessions)}
      </h1> */}
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
        style={{ height: "auto" }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                      className="p-3 border h-[45px] border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                    />
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
          <p className="text-center mt-3 font-extralight text-sm">
            Have no account{" "}
            <Link href={"/sign-up"} className="text-blue-700 underline">
              Sign Up
            </Link>
          </p>
        </Form>
        <div className="w-full mt-5 flex items-center justify-center  gap-2">
          <Button
            onClick={() =>
              signIn("google", { callbackUrl: "http://localhost:3000" })
            }
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded-xl transition-all"
          >
            <FaGoogle /> Sign In with Google
          </Button>
          <Button
            onClick={() =>
              signIn("github", { callbackUrl: "http://localhost:3000" })
            }
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded-xl transition-all"
          >
            <FaGithub /> Sign In with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

import Link from "next/link";
import React from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import UserNavbarButton from "../ui/UserNavbarButton";
import { Session } from "inspector/promises";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <div className="flex justify-between items-center p-4 py-8 bg-white shadow-sm shadow-gray-300">
        <Link href="/">
          {" "}
          <div className="font-semibold text-4xl font-serif">Zagol</div>
        </Link>
        <div>
          {session?.user ? (
            <div className="flex gap-2 items-center justify-center">
              <UserNavbarButton />
              {session?.user?.role === "admin" ? (
                <Link href={"/dashboard/admin"}>
                  <div className="bg-black text-white font-semibold px-5 py-2 rounded">
                    Admin Dashboard
                  </div>
                </Link>
              ) : session?.user?.role === "developer" ? (
                <Link href={"/dashboard/developer"}>
                  <div className="bg-black text-white font-semibold px-5 py-2 rounded">
                    Developer Dashboard
                  </div>
                </Link>
              ) : (
                <Link href={"/dashboard/reporter"}>
                  <div className="bg-black text-white font-semibold px-5 py-2 rounded">
                    Reporter Dashboard
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex gap-2 items-center justify-center">
              <Link
                href={"/sign-in"}
                className="text-lg font-semibold bg-black rounded-lg px-12 text-center  py-2  text-white hover:text-slate-800 hover:bg-white  hover:border-black hover:border-[1px]"
              >
                Sign In
              </Link>
              <Link
                href={"/sign-up"}
                className="text-lg font-semibold bg-black rounded-lg px-12 text-center  py-2  text-white hover:text-slate-800 hover:bg-white  hover:border-black hover:border-[1px]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

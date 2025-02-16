import Link from "next/link";
import React from "react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import UserNavbarButton from "../ui/UserNavbarButton";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <div className="flex justify-between items-center p-4 py-8 bg-white shadow-sm shadow-gray-300">
        <Link href="/">
          {" "}
          <div className="font-semibold text-4xl font-serif">LoGo</div>
        </Link>
        <div>
          {session?.user ? (
            <UserNavbarButton />
          ) : (
            <Link
              href={"/sign-in"}
              className="text-lg font-semibold bg-black rounded-lg px-12 py-4  text-white hover:text-slate-800 hover:bg-white  hover:border-black hover:border-[1px]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

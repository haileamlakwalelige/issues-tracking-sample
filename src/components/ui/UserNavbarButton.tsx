"use client";

import React from "react";

import { signOut } from "next-auth/react";
import { Button } from "./button";

const UserNavbarButton = () => {
  return (
    <div>
      <Button
        onClick={() =>
          signOut({
            redirect: true,
            callbackUrl: `/sign-in`,
          })
        }
        variant="destructive"
        className="text-lg font-semibold bg-red-400 rounded h-[45px] px-10 "
      >
        SignOut
      </Button>
    </div>
  );
};

export default UserNavbarButton;

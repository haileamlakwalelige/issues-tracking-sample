"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Search,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Comments from "@/components/reusalbe/Comments";
import EditProfile from "@/components/reusalbe/EditProfile";
;

export default function Page() {
  const { data: session, status } = useSession();
  const [active, setActive] = useState("My Comments");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session || session.user.role !== "reporter") {
      redirect("/sign-in"); // Redirect to sign-in page if not a reporter
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const menuItems = [
    {
      title: "My Comments",
      icon: Search,
      component: () => <Comments />,
    },
    {
      title: "Settings",
      icon: Settings,
      component: () => <EditProfile />,
      dropdown: [
        {
          title: "Logout",
          onClick: () =>
            signOut({
              redirect: true,
              callbackUrl: `/sign-in`,
            }),
        },
      ],
    },
  ];

  const ActiveComponent = menuItems.find(
    (item) => item.title === active
  )?.component;

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Issue Tracking</h2>
        <nav className="flex flex-col space-y-4 flex-grow">
          {menuItems.map((item) => (
            <motion.div key={item.title}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className={`flex items-center p-3 w-[200px] rounded-2xl ${
                  active === item.title ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
                onClick={() => {
                  setActive(item.title);
                  if (item.title === "Settings") setShowDropdown(!showDropdown);
                }}
              >
                <item.icon className="mr-3" />
                {item.title}
              </motion.button>
              {item.dropdown && showDropdown && (
                <div className="ml-8 mt-2 space-y-2">
                  {item.dropdown.map((dropdownItem) => (
                    <button
                      key={dropdownItem.title}
                      className="block text-left w-full px-3 py-2 hover:bg-gray-800 rounded"
                      onClick={dropdownItem.onClick}
                    >
                      {dropdownItem.title}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </nav>
      </div>

      <div className="flex-grow bg-gray-100 p-6 overflow-auto">
        {ActiveComponent ? <ActiveComponent /> : null}
      </div>
    </div>
  );
}
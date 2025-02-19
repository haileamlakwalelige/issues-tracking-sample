"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomeHero() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white relative overflow-hidden">
      <div className="text-center z-10 animate-fadeInUp">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slideIn">
          Track Issues Seamlessly
        </h1>
        <p className="text-lg md:text-2xl mb-8 animate-fadeIn delay-200">
          A powerful tool to manage and resolve project issues efficiently.
        </p>
        <Link href={!session ? '/sign-in':'/issues'}>
          {" "}
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition">
            Get Started
          </button>
        </Link>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-30 z-0"></div>
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-50 animate-bounceSlow"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-50 animate-bounceSlow delay-500"></div>
    </div>
  );
}

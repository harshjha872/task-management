"use client";
import Image from "next/image";
import React from "react";
import { NotepadText } from "lucide-react";
import { useAuth } from "@/lib/auth-context/authcontext";

const Navbar = () => {
  const { user } = useAuth() as any;
  return (
    <div className="flex w-full justify-between items-center px-6 py-4 shadow-md shadow-neutral-200 bg-pink-100  border-b ">
      <div className="flex md:space-x-2 items-center">
        <NotepadText className="hidden md:block" size={25} />
        <span className="text-lg">TaskBuddy</span>
      </div>
      <div className="flex space-x-2 items-center">
        <div className="relative h-8 w-8">
        <Image
          alt="userimage"
          className="rounded-full"
          layout="fill"
          src={user?.photoURL}
          objectFit="cover"
        />
        </div>
        <div className="hidden md:block">{user?.displayName}</div>
      </div>
    </div>
  );
};

export default Navbar;

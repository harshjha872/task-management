"use client";
import Image from "next/image";
import React from "react";
import { NotepadText } from "lucide-react";

const Navbar = () => {
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
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80"
          objectFit="cover"
        />
        </div>
        <div className="hidden md:block">Harsh Jha</div>
      </div>
    </div>
  );
};

export default Navbar;

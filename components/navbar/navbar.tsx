"use client";
import Image from "next/image";
import React from "react";
import { NotepadText } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex w-full justify-between items-center px-20 mt-12">
      <div className="flex space-x-2">
        <NotepadText size={25} />
        <span>TaskBuddy</span>
      </div>
      <div className="flex space-x-2">
        <Image
          alt="userimage"
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80"
          width={100}
          height={100}
        />

        <div>user name</div>
      </div>
    </div>
  );
};

export default Navbar;

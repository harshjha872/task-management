"use client";

// import { useAppSelector, useAppDispatch } from "./hooks";
// import { increaseCounter, decreaseCounter } from "@/store/todoSlice";
import { ChevronDown, Search } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import Accordian from "@/components/accordian/accordian";
export default function Home() {
  // const dispatch = useAppDispatch()
  // const counter = useAppSelector((state) => state.todoSlice.counter);

  return (
    <div className="">
      <Navbar />
      <div className="py-4 px-4 flex justify-end">
        <button className="bg-fuchsia-800 text-white px-6 py-3 rounded-full uppercase text-sm font-medium">
          Add task
        </button>
      </div>
      <div className="px-4">
        <div className="text-neutral-500 mb-2">Filter by:</div>
        <div className="flex space-x-2">
          <div className="flex space-x-2 items-center px-4 py-2 border border-neutral-400 shadow-sm rounded-full text-neutral-600">
            <span>Category</span>
            <ChevronDown size={15} />
          </div>
          <div className="flex space-x-2 items-center px-6 py-2 border border-neutral-400 shadow-sm rounded-full text-neutral-600">
            <span>Due date</span>
            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      <div className="px-4 w-full py-6 relative">
        <input
          placeholder="search"
          className="border-[1.5px] border-neutral-300 rounded-full py-3 px-11 w-full"
          type="text"
        />
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 left-8`}
        >
          <Search size={20} />
        </div>
      </div>

      <div className="px-4 space-y-4 flex flex-col items-center justify-center lg:justify-start lg:items-start">
        <Accordian title="Todo" Tasks={[]} header_color="bg-pink-200" />
        <Accordian title="In-progress" Tasks={[]} header_color="bg-sky-200" />
        <Accordian title="Completed" Tasks={[]} header_color="bg-green-200" />
      </div>
    </div>
  );
}

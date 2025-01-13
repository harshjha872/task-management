"use client";

// import { useAppSelector, useAppDispatch } from "./hooks";
// import { increaseCounter, decreaseCounter } from "@/store/todoSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  ChevronDown,
  Search,
  List,
  SquareKanban,
  LogOut,
  CircleX,
} from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import Addtaskmodal from "@/components/modals/addtaskmodal";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context/auth-context";
import { Todo } from "@/lib/Todo/Todo";
import TaskCategoryPanel from "@/components/task-category-panel/task-category-panel";
import Link from "next/link";

const Tabss = [
  { name: "List", icon: <List size={18} /> },
  { name: "Board", icon: <SquareKanban size={18} /> },
];

export default function Home() {
  const { user } = useAuth() as any;

  const closeModal = () => {
    setShowAddTaskModal(false);
  };
  // const dispatch = useAppDispatch()
  // const counter = useAppSelector((state) => state.todoSlice.counter);
  const [activeTab, setActiveTab] = useState(0);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const tasks = useAppSelector((state) => state.todoSlice.tasks);

  const getTasksOnBasisOf = (taskStatus: "todo" | "inprogress" | "completed") => tasks.filter((task:Todo) => task.taskStatus === taskStatus);
  
  return (
    <div className="">
      <Navbar />
      <div className="hidden lg:flex px-4 my-3 justify-between items-center">
        <div className="flex space-x-2">
          {Tabss.map((tab, index) => (
            <Link
              href="/kanbantest"
              onClick={() => setActiveTab(index)}
              key={index * 99}
              className={`${
                index === Number(activeTab)
                  ? "border-neutral-800"
                  : "border-transparent"
              } cursor-pointer transition-all duration-300 ease-in-out flex items-center border-b-2 p-1`}
            >
              <div className="mr-1">{tab.icon}</div>
              <div>{tab.name}</div>
            </Link>
          ))}
        </div>
        {user && (
          <button className="flex items-center rounded-lg border border-pink-300 bg-pink-50 px-3 py-2">
            <LogOut size={20} className="mr-1" />
            logout
          </button>
        )}
      </div>

      {/* Add task btn for mobile */}
      <div className="lg:hidden py-4 px-4 flex justify-end">
        <button
          onClick={() => setShowAddTaskModal(true)}
          className="bg-fuchsia-800 text-white px-6 py-3 rounded-full uppercase text-sm font-medium"
        >
          Add task
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:mx-4 lg:mb-3 lg:border-b-[1.5px] lg:border-neutral-200">
        <div className="flex flex-col lg:flex-row px-4 lg:px-0 lg:items-center">
          <div className="text-neutral-500 mb-2 mr-2">Filter by:</div>
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

        <div className="flex items-center">
          <div className="px-4 w-full lg:w-[300px] py-6 relative">
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
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="hidden lg:block bg-fuchsia-800 text-white px-6 py-3 rounded-full uppercase text-sm font-medium"
          >
            Add task
          </button>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-5 px-6 font-medium text-sm text-neutral-500 my-2">
        <div className="col-span-2">Task name</div>
        <div>Due on</div>
        <div>Task status</div>
        <div>Task Category</div>
      </div>

      <div className="px-4 space-y-4 flex flex-col items-center justify-center lg:justify-start lg:items-start">
        <TaskCategoryPanel title="Todo" Tasks={getTasksOnBasisOf('todo')} header_color="bg-pink-200" />
        <TaskCategoryPanel title="In-progress" Tasks={getTasksOnBasisOf('inprogress')} header_color="bg-sky-200" />
        <TaskCategoryPanel title="Completed" Tasks={getTasksOnBasisOf('completed')} header_color="bg-green-200" />
      </div>

      {/* Add task modal */}
      {showAddTaskModal && <Addtaskmodal closeModal={closeModal} />}
    </div>
  );
}

import { useState } from "react";
import { ChevronUp, CircleCheck } from "lucide-react";
import { Todo } from "@/lib/Todo/Todo";
import moment from "moment";
import EditTaskModal from "../modals/edittaskmodal";
import { Ellipsis } from 'lucide-react';
import { iTodo } from "@/lib/Todo/Todo";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TaskCategoryPanel({
  title,
  header_color,
  Tasks,
}: {
  title: string;
  header_color: string;
  Tasks: Array<Todo>;
}) {

  const [isOpen, setIsOpen] = useState(true);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const getConvertedDueDate = (date: Date) => {
    const jsDate = new Date(date);
    return moment(jsDate).format("D MMM, YYYY");
  };

  const closeModal = () => {
    setShowEditTaskModal(false);
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-t-xl transition-colors ${header_color}`}
      >
        <span className="font-medium">
          {title} ({Tasks.length})
        </span>
        <ChevronUp
          size={14}
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`
        bg-gray-50 rounded-b-xl overflow-hidden transition-all duration-200 ease-in-out
        ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
      >
        <div className="divide-y divide-gray-200">
          {Tasks.map((todo) => (
            <div key={todo.id} className="grid grid-cols-5 px-6 py-4">
              <div key={todo.id} className="col-span-2 flex items-center gap-3">
                <label className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={() => {}}
                    className="hidden"
                  />
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </label>
                <CircleCheck className="w-6 h-6 text-gray-400" />
                <span className="text-lg">{todo.taskName}</span>
              </div>
              <div>{getConvertedDueDate(todo.dueDate)}</div>
              <div className="bg-neutral-200 text-black rounded-md px-3 py-1 w-fit text-sm uppercase">
                {todo.taskStatus}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  {todo.taskCategory === "work" ? "Work" : "Personal"}  
                </div>
                <div onClick={() => setShowEditTaskModal(true)} className="hover:bg-neutral-200 cursor-pointer transition-all duration-300 p-2 rounded-md">
                  <Ellipsis size={15}/>
                </div>
              </div>
              
              {/* Edit task modal */}
              {showEditTaskModal && <EditTaskModal closeModal={closeModal} currentTodo={todo} />}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

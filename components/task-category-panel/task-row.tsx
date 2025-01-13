import { Todo } from "@/lib/Todo/Todo";
import moment from "moment";
import { CircleCheck, Ellipsis, GripVertical } from "lucide-react";
import { useState } from "react";
import EditTaskModal from "../modals/edittaskmodal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskRow({ todo }: { todo: Todo }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const getConvertedDueDate = (date: Date) => {
    const jsDate = new Date(date);
    return moment(jsDate).format("D MMM, YYYY");
  };

  const closeModal = () => {
    setShowEditTaskModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="grid grid-cols-5 px-6 py-4"
    >
      <div className="col-span-2 flex items-center gap-3">
        <label className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded cursor-pointer">
          <input type="checkbox" onChange={() => {}} className="hidden" />
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
        <GripVertical {...listeners} className="w-6 h-6 text-gray-400 hover:cursor-grab  active:cursor-grabbing"/>
        <CircleCheck className="w-6 h-6 text-gray-400" />
        <span className="text-lg">{todo.taskName}</span>
      </div>
      <div>{getConvertedDueDate(todo.dueDate)}</div>
      <div className="bg-neutral-200 text-black rounded-md px-3 py-1 w-fit text-sm uppercase">
        {todo.taskStatus}
      </div>
      <div className="flex justify-between items-center">
        <div>{todo.taskCategory === "work" ? "Work" : "Personal"}</div>
        <div
          onClick={() => {setShowEditTaskModal(true); console.log('clicked')}}
          className="hover:bg-neutral-200 cursor-pointer transition-all duration-300 p-2 rounded-md"
        >
          <Ellipsis size={15} />
        </div>
      </div>

      {/* Edit task modal */}
      {showEditTaskModal && (
        <EditTaskModal closeModal={closeModal} currentTodo={todo} />
      )}
    </div>
  );
}

import { Todo } from "@/lib/Todo/Todo";
import moment from "moment";
import {
  CircleCheck,
  Ellipsis,
  GripVertical,
  Trash2,
  PencilLine,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditTaskModal from "../modals/edittaskmodal";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CustomMenu from "../dropdown/dropdown";
import { useAuth } from "@/lib/auth-context/auth-context";
import { deleteTask, updateStatusSingleInStore } from "@/store/todoSlice";
import { useAppDispatch } from "@/store/hooks";
import { iTodo } from "@/lib/Todo/Todo";

const options = [
  {
    name: "edit",
  },
  { name: "delete" },
];

export default function TaskRow({
  todo,
  handleRowSelect,
  multiSelectRows,
}: {
  todo: iTodo;
  handleRowSelect: (docId:string) => void;
  multiSelectRows: Array<string>;
}) {
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dispatch = useAppDispatch();

  const { user } = useAuth() as any;

  const threedots = [
    {
      label: "Edit",
      onClick: () => setShowEditTaskModal(true),
      icon: <PencilLine size={15} color="black" />,
    },
    {
      label: "Delete",
      onClick: () => handleDeleteTask(),
      icon: <Trash2 size={15} color="red" />,
    },
  ];

  const changeStatus = [
    {
      label: "TODO",
      onClick: () => handleChangeStatusSingle("todo"),
    },
    {
      label: "IN-PROGRESS",
      onClick: () => handleChangeStatusSingle("inprogress"),
    },
    {
      label: "COMPLETED",
      onClick: () => handleChangeStatusSingle("completed"),
    },
  ];

  const handleChangeStatusSingle = (status: string) => {
    if (todo.taskStatus !== status) {
      const obj = new Todo(todo);
      obj.updateStatusSingle(user.email, status);
      dispatch(updateStatusSingleInStore({ id: obj.id, updateTo: status }));
    }
  };

  const getConvertedDueDate = (date: Date) => {
    const jsDate = new Date(date);
    if(moment(new Date).isSame(moment(jsDate), 'day')) return 'Today'
    else return moment(jsDate).format("D MMM, YYYY");
  };

  const closeModal = () => {
    setShowEditTaskModal(false);
  };

  const handleDeleteTask = () => {
    const newObj = new Todo(todo);
    newObj.deleteTaskInFirebase(user?.email);
    dispatch(deleteTask(newObj.id));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="grid lg:grid-cols-5 px-6 py-4"
    >
      <div className="lg:col-span-2 flex items-center gap-3">
        <label className="flex items-center justify-center w-5 h-5 rounded cursor-pointer">
          <input
            checked={multiSelectRows.includes(todo.docId)}
            onChange={() => handleRowSelect(todo.docId)}
            type="checkbox"
            value=""
            className="w-4 h-4 accent-fuchsia-900 bg-gray-100 border-gray-300 rounded"
          />
        </label>
        <GripVertical
          {...listeners}
          className="hidden lg:block w-6 h-6 text-gray-400 hover:cursor-grab  active:cursor-grabbing"
        />
        <CircleCheck className="w-6 h-6 text-gray-400" />
        <span className={`text-sm lg:text-lg ${todo.taskStatus === 'completed' ? 'line-through' : ''}`}>{todo.taskName}</span>
      </div>
      <div className="hidden lg:block">{getConvertedDueDate(todo.dueDate)}</div>
      <div className="hidden lg:block bg-neutral-200 text-black rounded-md px-3 py-1 w-fit text-sm uppercase">
        <CustomMenu items={changeStatus}>{todo.taskStatus}</CustomMenu>
      </div>
      <div className="hidden lg:flex justify-between items-center">
        <div>{todo.taskCategory === "work" ? "Work" : "Personal"}</div>
        <CustomMenu items={threedots}>
          <div className="relative hover:bg-neutral-200 cursor-pointer transition-all duration-300 p-2 rounded-md">
            <Ellipsis size={15} />
          </div>
        </CustomMenu>
      </div>

      {/* Edit task modal */}
      {showEditTaskModal && (
        <EditTaskModal closeModal={closeModal} currentTodo={todo} />
      )}
    </div>
  );
}

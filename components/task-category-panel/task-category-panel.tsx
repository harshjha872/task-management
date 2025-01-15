import { useState } from "react";
import {
  ChevronUp,
  CircleCheck,
  GripVertical,
  Plus,
  Files,
} from "lucide-react";
import { Todo } from "@/lib/Todo/Todo";
import TaskRow from "./task-row";
import { useAppDispatch } from "@/store/hooks";
import { reorderTasks } from "@/store/todoSlice";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import TaskMiniForm from "./task-mini-form";
import { iTodo } from "@/lib/Todo/Todo";
import CustomMenu from "../dropdown/dropdown";
import { useAuth } from "@/lib/auth-context/auth-context";
import { updateStatusMulitpleInStore, deleteMultipleInStore } from "@/store/todoSlice";

export default function TaskCategoryPanel({
  title,
  header_color,
  Tasks,
  handleRowSelect,
  multiSelectRows
}: {
  title: string;
  header_color: string;
  Tasks: Array<iTodo>;
  handleRowSelect: (docId: string) => void,
  multiSelectRows: Array<string>
}) {
  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = Tasks.findIndex((item) => item.id === active.id);
      const newIndex = Tasks.findIndex((item) => item.id === over.id);
      const newTasks = arrayMove(Tasks, oldIndex, newIndex);
      dispatch(reorderTasks(newTasks));
    }
  }
  
  const [isOpen, setIsOpen] = useState(true);
  const [showMiniForm, setShowMiniForm] = useState(false);

  const closeForm = () => {
    setShowMiniForm(false);
  };

  return (
    <>
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

        {/* Mini form */}
        {title === "Todo" && (
          <div className="hidden lg:block">
            <div className="grid lg:grid-cols-5 px-6 py-4 border-b">
              <div className="lg:col-span-2 flex items-center gap-3">
                <label className="flex items-center justify-center w-5 h-5 rounded cursor-pointer">
                  <div className="w-4 h-4"></div>
                </label>
                <div className=" w-6 h-6 text-gray-400" />
                <div className="flex space-x-1">
                  <Plus
                    size={18}
                    onClick={() => setShowMiniForm(true)}
                    className="text-fuchsia-800"
                  />
                  <span className="text-sm">ADD TASK</span>
                </div>
              </div>
            </div>
            {showMiniForm && <TaskMiniForm closeForm={closeForm} />}
          </div>
        )}
        {/* Accordion Content */}
        <div
          className={`
        bg-gray-50 rounded-b-xl transition-all duration-200 ease-in-out
        ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
        >
          <div className="divide-y divide-gray-200">
            {isOpen && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={Tasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {Tasks.map((todo) => (
                    <TaskRow
                      key={todo.id}
                      todo={todo}
                      handleRowSelect={handleRowSelect}
                      multiSelectRows={multiSelectRows}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

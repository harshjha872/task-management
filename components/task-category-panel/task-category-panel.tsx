import { useState } from "react";
import { ChevronUp, CircleCheck } from "lucide-react";
import { Todo } from "@/lib/Todo/Todo";
import moment from "moment";
import EditTaskModal from "../modals/edittaskmodal";
import { Ellipsis } from "lucide-react";
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  const dispatch = useAppDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event:any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = Tasks.findIndex((item) => item.id === active.id);
      const newIndex = Tasks.findIndex((item) => item.id === over.id);
      dispatch(reorderTasks({ oldIndex, newIndex }));
    }
  }
  const [isOpen, setIsOpen] = useState(true);

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

        {/* Accordion Content */}
        <div
          className={`
        bg-gray-50 rounded-b-xl overflow-hidden transition-all duration-200 ease-in-out
        ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
      `}
        >
          <div className="divide-y divide-gray-200">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={Tasks}
                strategy={verticalListSortingStrategy}
              >
                {Tasks.map((todo) => (
                  <TaskRow key={todo.id} todo={todo} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </>
  );
}

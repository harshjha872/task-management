"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import {
  reorderTasksKanban,
  deleteTask,
} from "@/store/todoSlice";
import { iTodo } from "@/lib/Todo/Todo";
import { Ellipsis, PencilLine, Trash2 } from "lucide-react";
import moment from "moment";
import CustomMenu from "../dropdown/dropdown";
import { Todo } from "@/lib/Todo/Todo";
// import { useAuth } from "@/lib/auth-context/auth-context";
import EditTaskModal from "../modals/edittaskmodal";

export default function KanbanBoard({
  getTasksOnBasisOf,
}: {
  getTasksOnBasisOf: (taskStatus: string) => iTodo[];
}) {
  const dispatch = useDispatch();
  const tasks = useAppSelector((state) => state.todoSlice.tasks);

  const [activeId, setActiveId] = useState(null);

  const columns = {
    todo: {
      id: "todo",
      title: "TO-DO",
      bg: "bg-pink-200",
      display: "todo",
    },
    "in-progress": {
      id: "inprogress",
      title: "in-progress",
      bg: "bg-sky-200",
      display: "In Progress",
    },
    completed: {
      id: "completed",
      title: "Completed",
      bg: "bg-green-200",
      display: "Completed",
    },
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (!activeTask || !overTask) return;

    if (
      activeTask.taskStatus === overTask.taskStatus &&
      active.id !== over.id
    ) {
      const oldIndex = tasks
        .filter((task) => task.taskStatus === activeTask.taskStatus)
        .findIndex((task) => task.id === active.id);
      const newIndex = tasks
        .filter((task) => task.taskStatus === activeTask.taskStatus)
        .findIndex((task) => task.id === over.id);

      dispatch(
        reorderTasksKanban({
          status: activeTask.taskStatus,
          oldIndex,
          newIndex,
        })
      );
    }
  };

  const activeTask = activeId
    ? tasks.find((task) => task.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 h-full">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="w-[350px]">
            <div
              className={`rounded-xl flex flex-col bg-neutral-100 border border-neutral-200 p-4 h-full`}
            >
              <div
                className={`w-fit uppercase text-sm rounded-md px-4 py-1 mb-4 ${column.bg}`}
              >
                {column.title}
              </div>
              <div
                className={`${
                  getTasksOnBasisOf(column.id).length == 0
                    ? "flex items-center flex-1 justify-center"
                    : ""
                } space-y-2 mt-2`}
              >
                <SortableContext
                  items={getTasksOnBasisOf(column.id).map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {getTasksOnBasisOf(column.id).length == 0 ? (
                    <div className="text-neutral-500">{`No tasks in ${column.display}`}</div>
                  ) : (
                    getTasksOnBasisOf(column.id).map((task) => (
                      <SortableTask key={task.id} task={task} />
                    ))
                  )}
                </SortableContext>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <SortableTask task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

// SortableTask.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableTask = ({ task }: { task: iTodo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const dispatch = useDispatch();
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const closeModal = () => {
    setShowEditTaskModal(false);
  };

  // const { user } = useAuth() as any;
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

  const handleDeleteTask = () => {
    const newObj = new Todo(task);
    // newObj.deleteTaskInFirebase(user?.email);
    dispatch(deleteTask(newObj.id));
  };

  const getConvertedDueDate = (date: Date) => {
    const jsDate = new Date(date);
    if (moment(new Date()).isSame(moment(jsDate), "day")) return "Today";
    else return moment(jsDate).format("D MMM, YYYY");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white grid gap-5 border rounded-lg p-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative"
    >
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h4
            className={`font-semibold ${
              task.taskStatus === "completed" ? "line-through" : ""
            }`}
          >
            {task.taskName}
          </h4>
          <CustomMenu items={threedots}>
            <Ellipsis
              color="black"
              size={17}
              className="cursor-pointer z-[999999]"
            />
          </CustomMenu>
        </div>
        <p className="text-sm text-gray-600">{task.taskDescription}</p>
      </div>
      <div></div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-500">{task.taskCategory}</div>
        <div className=" text-xs text-neutral-500">
          {getConvertedDueDate(task.dueDate)}
        </div>
      </div>

      {/* Edit task modal */}
      {showEditTaskModal && (
        <EditTaskModal closeModal={closeModal} currentTodo={task} />
      )}
    </div>
  );
};

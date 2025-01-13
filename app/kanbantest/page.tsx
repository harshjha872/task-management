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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "@/store/hooks";
import { reorderTasksKanban, updateTaskStatus } from "@/store/todoSlice";

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const tasks = useAppSelector((state) => state.todoSlice.tasks);

  const [activeId, setActiveId] = useState(null);

  const columns = {
    todo: {
      id: "todo",
      title: "To Do",
      bgColor: "bg-gray-100",
    },
    "in-progress": {
      id: "inprogress",
      title: "In Progress",
      bgColor: "bg-blue-50",
    },
    completed: {
      id: "completed",
      title: "Completed",
      bgColor: "bg-green-50",
    },
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    console.log('active',active, over)
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);

    // Find if we're over a column or a task
    const overId = over.id;
    let overStatus;

    // Check if we're directly over a column
    if (overId in columns) {
      overStatus = overId;
    } else {
      // If we're over another task, get its status
      const overTask = tasks.find((task) => task.id === overId);
      overStatus = overTask?.taskStatus;
    }

    // Only update if we have a valid status and it's different
    if (activeTask && overStatus && activeTask.taskStatus !== overStatus) {
      dispatch(
        updateTaskStatus({
          taskId: activeTask.id,
          newStatus: overStatus,
        })
      );
    }
  };

  const handleDragEnd = (event) => {
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

  const getTasksByStatus = (status) => {
    console.log(status);
    console.log(tasks);
    console.log(tasks.filter((task) => task.taskStatus === status));
    return tasks.filter((task) => task.taskStatus === status);
  };

  const activeTask = activeId
    ? tasks.find((task) => task.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 h-full min-h-screen bg-gray-50">
        {Object.values(columns).map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            bgColor={column.bgColor}
          >
            <SortableContext
              items={getTasksByStatus(column.id).map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {getTasksByStatus(column.id).map((task) => (
                <SortableTask key={task.id} task={task} />
              ))}
            </SortableContext>
          </Column>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="bg-white rounded-lg p-4 shadow-lg w-full">
            <h3 className="font-medium mb-2">{activeTask.taskName}</h3>
            <p className="text-sm text-gray-600">
              {activeTask.taskDescription}
            </p>
            {activeTask.dueDate && (
              <div className="mt-2 text-xs text-gray-500">
                Due: {new Date(activeTask.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// Column.tsx
const Column = ({ id, title, bgColor, children }) => {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`rounded-lg ${bgColor} p-4 h-full`}>
        <h2 className="font-semibold mb-4">{title}</h2>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
};

// SortableTask.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableTask = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <h3 className="font-medium mb-2">{task.taskName}</h3>
      <p className="text-sm text-gray-600">{task.taskDescription}</p>
      {task.dueDate && (
        <div className="mt-2 text-xs text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;

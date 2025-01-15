import { ArrowUpDown, Files } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTasksFromDb } from "@/store/todoSlice";
import { useState } from "react";
import TaskCategoryPanel from "../task-category-panel/task-category-panel";
import { Todo, iTodo } from "@/lib/Todo/Todo";
import {
  deleteMultipleInStore,
  updateStatusMulitpleInStore,
} from "@/store/todoSlice";
import { useAuth } from "@/lib/auth-context/auth-context";
import CustomMenu from "../dropdown/dropdown";

export default function ListView({
  getTasksOnBasisOf,
}: {
  getTasksOnBasisOf: (
    taskStatus: "todo" | "inprogress" | "completed"
  ) => iTodo[];
}) {
  const { user } = useAuth() as any;
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.todoSlice.tasks);
  const [sorting, setSorting] = useState("asc");

  const handleDeleteMultiple = async () => {
    await Todo.deleteMultipleTasks(user?.email, multiSelectRows);
    dispatch(deleteMultipleInStore(multiSelectRows));
    setMultiSelectRows([]);
  };

  const [multiSelectRows, setMultiSelectRows] = useState<Array<string>>([]);

  const handleRowSelect = (id: string) => {
    setMultiSelectRows((prevRows) => {
      if (prevRows.includes(id)) {
        return prevRows.filter((Preid) => id !== Preid);
      } else {
        return [...prevRows, id];
      }
    });
  };

  const handleChangeStatusMultiple = async (
    status: "todo" | "inprogress" | "completed"
  ) => {
    await Todo.updateMultipleStatus(user?.email, multiSelectRows, status);
    dispatch(updateStatusMulitpleInStore({ ids: multiSelectRows, status }));
    setMultiSelectRows([]);
  };

  console.log(user)
  const changeStatus = [
    {
      label: "TODO",
      onClick: () => handleChangeStatusMultiple("todo"),
    },
    {
      label: "IN-PROGRESS",
      onClick: () => handleChangeStatusMultiple("inprogress"),
    },
    {
      label: "COMPLETED",
      onClick: () => handleChangeStatusMultiple("completed"),
    },
  ];

  const handleSortingOnDueDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate) as any;
      const dateB = new Date(b.dueDate) as any;
      return sorting === "asc" ? dateA - dateB : dateB - dateA;
    });

    dispatch(setTasksFromDb(sortedTasks));
    setSorting((prevOrder) => (prevOrder === "asc" ? "desc" : "asc")); // Toggle sort order
  };

  console.log(multiSelectRows);

  return (
    <div className="lg:border-t-[1.5px] pt-2">
      <div className="hidden lg:grid grid-cols-5 px-6 font-medium text-sm text-neutral-500 my-2">
        <div className="col-span-2">Task name</div>
        <div className="flex items-center">
          <span>Due on</span>
          <ArrowUpDown
            onClick={handleSortingOnDueDate}
            className="ml-2 cursor-pointer"
            size={13}
          />
        </div>
        <div>Task status</div>
        <div>Task Category</div>
      </div>

      <div className="px-4 space-y-4 flex flex-col items-center justify-center lg:justify-start lg:items-start">
        <TaskCategoryPanel
          title="Todo"
          Tasks={getTasksOnBasisOf("todo")}
          header_color="bg-pink-200"
          handleRowSelect={handleRowSelect}
          multiSelectRows={multiSelectRows}
        />
        <TaskCategoryPanel
          title="In-progress"
          Tasks={getTasksOnBasisOf("inprogress")}
          header_color="bg-sky-200"
          handleRowSelect={handleRowSelect}
          multiSelectRows={multiSelectRows}
        />
        <TaskCategoryPanel
          title="Completed"
          Tasks={getTasksOnBasisOf("completed")}
          header_color="bg-green-200"
          handleRowSelect={handleRowSelect}
          multiSelectRows={multiSelectRows}
        />
      </div>
      {multiSelectRows.length > 0 && (
        <div className="fixed inset-x-0 z-[999] text-white flex bottom-2 bg-transparent rounded-md w-full items-center justify-center text-sm">
          <div className="bg-neutral-900 flex items-center justify-center p-3 rounded-lg">
            <div className="border mr-2 rounded-lg border-neutral-700 px-3 py-1">
              {`${multiSelectRows.length} tasks selected`}
            </div>
            <Files size={15} className="mr-12" />
            <CustomMenu items={changeStatus} background="black" position="top">
              <div className="border rounded-lg border-neutral-700 px-3 py-1">
                Status
              </div>
            </CustomMenu>
            <div
              onClick={handleDeleteMultiple}
              className="text-red-600 hover:bg-red-950/60 border bg-red-950/40 rounded-lg border-red-700/30 px-3 py-1 ml-2 cursor-pointer"
            >
              Delete
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

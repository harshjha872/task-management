"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  ChevronDown,
  Search,
  List,
  SquareKanban,
  LogOut,
  X,
} from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import Addtaskmodal from "@/components/modals/addtaskmodal";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context/auth-context";
import { Todo, iTodo } from "@/lib/Todo/Todo";
import { setTasksFromDb } from "@/store/todoSlice";
import CustomMenu from "@/components/dropdown/dropdown";
import DatePicker from "react-datepicker";
import { isDateInRange } from "@/lib/utils/utils";
import moment from "moment";
import KanbanBoard from "@/components/kanban/kanban";
import ListView from "@/components/listview/listview";
import { useRouter } from "next/navigation";

const Tabss = [
  { name: "List", icon: <List size={18} /> },
  { name: "Board", icon: <SquareKanban size={18} /> },
];

export default function Home() {
  const { user, logout } = useAuth() as any;

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Home useEffect [user] - user:", user);
    if (!user?.email) return;
    (async () => {
      const allTasks = await Todo.getTasksFromLocalStorage(user?.email);
      console.log("Home useEffect - allTasks fetched:", allTasks);
      dispatch(setTasksFromDb(JSON.parse(JSON.stringify(allTasks))));
    })();
  }, [user]);

  const closeModal = () => {
    setShowAddTaskModal(false);
  };

  const [activeTab, setActiveTab] = useState(0);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const tasks = useAppSelector((state: RootState) => state.todoSlice.tasks);

  const onChangeDateRange = (dates: any) => {
    const [start, end] = dates;
    setActiveFilters((pre) => {
      return {
        ...pre,
        dueDate: [start, end],
      } as filters;
    });
  };

  const filterCategory = [
    {
      label: "WORK",
      onClick: () => handlefilterCategory("work"),
    },
    {
      label: "PERSONAL",
      onClick: () => handlefilterCategory("personal"),
    },
  ];

  interface filters {
    taskCategory?: "work" | "personal" | null;
    dueDate?: [Date, Date] | null;
  }

  const [activeFilters, setActiveFilters] = useState<filters | null>(null);

  const handlefilterCategory = (category: string) => {
    setActiveFilters((pre) => {
      return {
        ...pre,
        taskCategory: category,
      } as filters;
    });
  };

  const [searchTask, setSearchTasks] = useState("");

  const handleSearchTask = (e: any) => {
    setSearchTasks(e.target.value);
  };

  const getTasksOnBasisOf = (taskStatus: string) => {
    const filteredTasks = tasks.filter(
      (task: iTodo) => task.taskStatus === taskStatus
    );
    return filteredTasks.filter((tasks: iTodo) => {
      const matchSearch = tasks.taskName
        .toLowerCase()
        .includes(searchTask.toLowerCase());

      const matchesCategory =
        activeFilters?.taskCategory === undefined ||
        activeFilters?.taskCategory === null ||
        tasks.taskCategory === activeFilters?.taskCategory;

      const matchesDueDate =
        activeFilters?.dueDate === null ||
        activeFilters?.dueDate === undefined ||
        isDateInRange(
          tasks.dueDate,
          activeFilters?.dueDate[0],
          activeFilters?.dueDate[1]
        );

      return matchesCategory && matchesDueDate && matchSearch;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="hidden lg:flex px-4 my-3 justify-between items-center">
        <div className="flex space-x-2">
          {Tabss.map((tab, index) => (
            <div
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
            </div>
          ))}
        </div>
        {user && (
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="flex items-center rounded-lg border border-pink-300 bg-pink-50 px-3 py-2"
          >
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

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:mx-4 lg:border-neutral-200">
        <div className="flex flex-col lg:flex-row px-4 lg:px-0 lg:items-center">
          <div className="text-neutral-500 mb-2 mr-2">Filter by:</div>
          <div className="flex space-x-2">
            {activeFilters?.taskCategory ? (
              <div className="flex space-x-2 items-center px-4 py-2 border bg-fuchsia-900 text-white border-neutral-400 shadow-sm rounded-full">
                <span>{activeFilters?.taskCategory}</span>
                <X
                  className="cursor-pointer"
                  onClick={() =>
                    setActiveFilters((pre) => ({ ...pre, taskCategory: null }))
                  }
                  size={15}
                />
              </div>
            ) : (
              <CustomMenu items={filterCategory}>
                <div className="flex space-x-2 items-center px-4 py-2 border border-neutral-400 shadow-sm rounded-full text-neutral-600">
                  <span>Category</span>
                  <ChevronDown size={15} />
                </div>
              </CustomMenu>
            )}

            {activeFilters?.dueDate &&
            activeFilters?.dueDate[0] &&
            activeFilters?.dueDate[1] ? (
              <div className="flex space-x-2 items-center px-6 py-2 border border-neutral-400 shadow-sm rounded-full text-white bg-fuchsia-800">
                <span>{`${moment(activeFilters?.dueDate[0]).format(
                  "D MMM, YYYY"
                )} - ${moment(activeFilters?.dueDate[1]).format(
                  "D MMM, YYYY"
                )}`}</span>
                <X
                  size={15}
                  onClick={() =>
                    setActiveFilters((pre) => ({ ...pre, dueDate: null }))
                  }
                />
              </div>
            ) : (
              <div className="relative">
                <DatePicker
                  wrapperClassName="datePickerFilter"
                  selected={null}
                  onChange={onChangeDateRange}
                  placeholderText="Due date"
                  startDate={
                    activeFilters?.dueDate ? activeFilters?.dueDate[0] : null
                  }
                  endDate={
                    activeFilters?.dueDate ? activeFilters?.dueDate[1] : null
                  }
                  selectsRange
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-700 h-5 w-5" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="px-4 w-full lg:w-[300px] py-6 relative">
            <input
              onChange={handleSearchTask}
              value={searchTask}
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

      {(activeFilters?.taskCategory || activeFilters?.dueDate || searchTask) &&
      getTasksOnBasisOf("todo").length === 0 &&
      getTasksOnBasisOf("inprogress").length === 0 &&
      getTasksOnBasisOf("completed").length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <img src="/SearchNotFound.jpg" alt="nothing found" />
          <span className="text-lg font-semibold mt-2">

          it looks like we cant find any results that match{" "}
          </span>
        </div>
      ) : (
        <div className={`${activeFilters !== null ? "" : "flex-1"}`}>
          {activeTab === 0 ? (
            <ListView getTasksOnBasisOf={getTasksOnBasisOf} />
          ) : (
            <KanbanBoard getTasksOnBasisOf={getTasksOnBasisOf} />
          )}
        </div>
      )}
      {/* Add task modal */}
      {showAddTaskModal && <Addtaskmodal closeModal={closeModal} />}
    </div>
  );
}

import React, { useState } from "react";
import { CircleX } from "lucide-react";
import { ChevronDown, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { useAppDispatch } from "@/store/hooks";
import "react-datepicker/dist/react-datepicker.css";
import { Todo, iTodo } from "@/lib/Todo/Todo";
import Form from "next/form";
import { editSingleTodo } from "@/store/todoSlice";
import moment from "moment";

export default function EditTaskModal({
  closeModal,
  currentTodo,
}: {
  closeModal: () => void;
  currentTodo: Todo;
}) {
  const [editTodo, setEditTodo] = useState<iTodo>(
    JSON.parse(JSON.stringify(currentTodo))
  );

  const dispatch = useAppDispatch();

  const handleSetDate = (date: any) => {
    setEditTodo(
      (pre) =>
        ({
          ...pre,
          dueDate: date,
        } as iTodo)
    );
  };

  const handleSelectCategory = (selectedCategory: string) => {
    setEditTodo(
      (pre) =>
        ({
          ...pre,
          taskCategory: selectedCategory,
        } as iTodo)
    );
  };

  const handleTaskNameChange = (e: any) => {
    setEditTodo(
      (pre) =>
        ({
          ...pre,
          taskName: e.target.value || "",
        } as iTodo)
    );
  };

  const handleTaskDescriptionChange = (e: any) => {
    setEditTodo(
      (pre) =>
        ({
          ...pre,
          taskDescription: e.target.value || "",
        } as iTodo)
    );
  };

  const handleStatusChange = (e: any) => {
    setEditTodo(
      (pre) =>
        ({
          ...pre,
          taskStatus: e.target.value,
        } as iTodo)
    );
  };

  const handleEditTodo = () => {
    const editedObj = new Todo(editTodo);
    dispatch(editSingleTodo(JSON.parse(JSON.stringify(editedObj))));
    closeAndResetForm()
  };

  console.log(editTodo);

  //   const handleFormSubmit = () => {
  //     console.log("submit");
  //     if (editTodo) {
  //       const newTodoObj = new Todo(editTodo);
  //       dispatch(addTodo(JSON.parse(JSON.stringify(newTodoObj))));
  //     }

  //     closeModal();
  //   };

  const closeAndResetForm = () => {
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-[70rem]">
        <div className="flex justify-between items-center border-b py-5 px-4">
          <h2 className="text-xl">Edit task</h2>
          <button
            onClick={() => closeAndResetForm()}
            className="text-gray-400 hover:text-gray-600"
          >
            <CircleX />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="px-4 py-3 grid gap-3 col-span-3">
            {/* Task title */}
            <div>
              <input
                required
                className="border border-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-50 w-full px-3 py-1.5 placeholder:text-sm"
                placeholder="Task title"
                value={editTodo?.taskName || ""}
                onChange={handleTaskNameChange}
              />
            </div>

            {/* description textarea */}
            <div>
              <textarea
                className="border focus:ring-neutral-300 border-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-50 w-full px-3 py-2 placeholder:text-sm"
                placeholder="Description"
                value={editTodo?.taskDescription || ""}
                onChange={handleTaskDescriptionChange}
              />
            </div>

            {/* Category, date and status */}
            <div className="grid grid-cols-3 gap-3">
              {/* Category */}
              <div>
                <div className="text-sm text-neutral-500 mb-2">
                  Task Catergory*
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSelectCategory("work")}
                    className={`px-6 py-2 text-sm rounded-full font-medium border ${
                      editTodo?.taskCategory === "work"
                        ? "bg-fuchsia-800 text-white"
                        : ""
                    }`}
                  >
                    Work
                  </button>
                  <button
                    onClick={() => handleSelectCategory("personal")}
                    className={`px-6 py-2 text-sm rounded-full font-medium border ${
                      editTodo?.taskCategory === "personal"
                        ? "bg-fuchsia-800 text-white"
                        : ""
                    }`}
                  >
                    Personal
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <div className="text-sm text-neutral-500 mb-2">Due date*</div>
                <div className="relative">
                  <DatePicker
                    wrapperClassName="datePicker"
                    selected={editTodo?.dueDate}
                    placeholderText="DD/MM/YYYY"
                    onChange={handleSetDate}
                  />
                  {/* <input
                        required
                        className="border border-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-50 w-full px-3 py-1.5 placeholder:text-sm"
                        placeholder="DD/MM/YYYY"
                        /> */}
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-700 h-5 w-5" />
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-sm text-neutral-500 mb-2">
                  Task status*
                </div>
                <div className="grid">
                  <ChevronDown className="pointer-events-none z-10 right-[.5rem] text-neutral-700 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden" />
                  <select
                    id="countries"
                    className="row-start-1 col-start-1 bg-neutral-50 border border-neutral-300 text-neutral-500 text-sm rounded-lg focus:ring-neutral-300 focus:border-neutral-300 block w-full p-[.58rem] pr-[2.5rem] appearance-none placeholder:text-sm"
                    onChange={handleStatusChange}
                    defaultValue={editTodo.taskStatus}
                  >
                    <option hidden>Choose</option>
                    <option value="todo">TO-DO</option>
                    <option value="inprogress">IN-PROGRESS</option>
                    <option value="completed">COMPLETED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="mb-40">
              <div className="text-sm text-neutral-500 mb-2">Attachment</div>
              <div className="w-full border border-neutral-300 text-neutral-500 rounded-lg bg-neutral-50 px-3 py-2 flex justify-center">
                <span>
                  Drop your files here or{" "}
                  <span className="text-indigo-500 underline">Update</span>
                </span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="flex flex-col col-span-2 bg-neutral-100 border-l-[1px] border-neutral-300">
            <div className="bg-white p-4 text-neutral-600 border-b-[1px] border-neutral-300">
              Activity
            </div>
            <div className="flex flex-col space-y-2 pt-4 flex-1 overflow-y-auto">
              {editTodo.historyActivity.map(
                (activity: { status: string; at: Date }, index) => (
                  <div className="flex justify-between px-4 text-neutral-600 text-sm" key={index}>
                    <div className="w-[75%]">{activity.status}</div>
                    <div>{moment(activity.at).format("D MMM, YYYY")}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="px-4 py-4 rounded-2xl rounded-tl-none rounded-tr-none flex justify-end space-x-2 bg-neutral-100 border-t border-neutral-300">
          <button
            onClick={() => closeAndResetForm()}
            className="text-sm px-4 py-1 uppercase rounded-full border border-neutral-300 bg-white"
          >
            cancel
          </button>
          <button
            onClick={handleEditTodo}
            type="submit"
            className="text-sm px-4 py-1 uppercase bg-fuchsia-600 text-white rounded-full"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

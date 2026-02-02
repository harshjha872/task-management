import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ChevronDown, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { useAppDispatch } from "@/store/hooks";
import "react-datepicker/dist/react-datepicker.css";
import { Todo, iTodo } from "@/lib/Todo/Todo";
import Form from "next/form";
import moment from "moment";
import { useAuth } from "@/lib/auth-context/auth-context";
import { TaskFormData, taskSchema } from "@/lib/utils/schema";
import { z } from "zod";
import { removeSpaceFromFileName } from "@/lib/utils/utils";
import { editSingleTodo } from "@/store/todoSlice";

export default function EditTaskModal({
  closeModal,
  currentTodo,
}: {
  closeModal: () => void;
  currentTodo: iTodo;
}) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [fileUpload, setFileUpload] = useState<{
    fileName: string;
    file: File;
  } | null>(null);

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const [editTodo, setEditTodo] = useState<iTodo>(
    JSON.parse(JSON.stringify(currentTodo))
  );
  const [imagePreview, setImagePreview] = useState(null as any);
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");

  const { user } = useAuth() as any;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateForm = (data: TaskFormData) => {
    try {
      taskSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<TaskFormData>);
      }
      return false;
    }
  };

  const handleTabChange = (e: any) => {
    setActiveTab(e.target.value);
  };

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

  const handleSelectCategory = (e: any) => {
    setEditTodo(
      (pre) =>
        ({
          ...pre,
          taskCategory: e.target.value,
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

  const handleEditTodo = async (formData: FormData) => {
    const data = Object.fromEntries(formData) as unknown as TaskFormData;
    if (validateForm(data)) {
      const editedObj = new Todo(editTodo);
      if (user) {
        try {
          await editedObj.updateTaskInLocalStorage(user.email, currentTodo, fileUpload ?? undefined);
        } catch(err) {
          console.log(err)
        }
        dispatch(editSingleTodo(JSON.parse(JSON.stringify(editedObj))));
      }
      closeAndResetForm();
    }
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
    removeImagePreview();
  };

  async function handleFileInputChange(e: any) {
    const Doctype = [ "application/pdf",
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

    const file = e.target.files[0];
    if (!file) return;

    if(!Doctype.includes(file.type)) {
      const reader = new FileReader();
  
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    removeCurrentAttachment()
    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);

    setFileUpload({ file: file, fileName: removeSpaceFromFileName(file.name) });
  }

  const removeCurrentAttachment = () => {
    setEditTodo(
      (pre) =>
        ({
          ...pre,
          attachment: null,
          attachmentUrl: null,
        } as iTodo)
    );
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    setFileUpload(null);
  };

  return (
    <Form
      action={handleEditTodo}
      className="fixed inset-0 z-50 flex lg:items-center items-end justify-center bg-black bg-opacity-50"
    >
      <div
        className={`bg-white relative rounded-2xl shadow-lg lg:w-[70rem] rounded-br-none rounded-bl-none rounded-tr-2xl rounded-tl-2xl lg:rounded-2xl ${
          activeTab === "activity" && windowSize.width < 1024 ? "h-[700px]" : ""
        } overflow-auto max-h-[680px] lg:h-auto w-full`}
      >
        <div className="flex flex-none justify-between items-center border-b py-5 px-4">
          <h2 className="text-xl">Edit task</h2>
          <button
            onClick={() => closeAndResetForm()}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-auto lg:grid lg:grid-cols-5 gap-2">
          {/* Details & activity tab */}
          <div className="flex lg:hidden space-x-2 px-4 pt-3">
            <label className="cursor-pointer">
              <input
                defaultChecked
                type="radio"
                name="editTabs"
                value="details"
                className="sr-only peer"
                onChange={handleTabChange}
              />
              <div className="px-12 md:px-20 uppercase py-1 text-sm rounded-full font-medium border peer-checked:bg-neutral-900 peer-checked:text-white">
                details
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="editTabs"
                value="activity"
                className="sr-only peer"
                onChange={handleTabChange}
              />
              <div className="px-8 md:px-4 uppercase py-1 text-sm rounded-full font-medium border peer-checked:bg-neutral-900 peer-checked:text-white">
                Activity
              </div>
            </label>
          </div>

          <div
            className={`${
              windowSize.width < 1024
                ? activeTab === "details"
                  ? "grid"
                  : "hidden"
                : "grid"
            } px-4 py-3 grid gap-3 col-span-3 w-full`}
          >
            {/* Task title */}
            <div>
              <input
                name="taskName"
                className="border border-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-50 w-full px-3 py-1.5 placeholder:text-sm"
                placeholder="Task title"
                value={editTodo?.taskName || ""}
                onChange={handleTaskNameChange}
              />
              {errors.taskName && (
                <p className="mt-1 text-[.7rem] text-red-600">
                  {errors.taskName}
                </p>
              )}
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
            <div className="lg:grid lg:grid-cols-3 flex flex-wrap gap-3">
              {/* Category */}
              <div>
                <div className="text-sm text-neutral-500 mb-2">
                  Task Catergory*
                </div>
                <div className="flex space-x-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="taskCategory"
                      value="work"
                      className="sr-only peer"
                      defaultChecked={editTodo?.taskCategory === "work"}
                      onChange={handleSelectCategory}
                    />
                    <div className="px-6 py-2 text-sm rounded-full font-medium border peer-checked:bg-fuchsia-800 peer-checked:text-white">
                      Work
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="taskCategory"
                      value="personal"
                      className="sr-only peer"
                      defaultChecked={editTodo?.taskCategory === "personal"}
                      onChange={handleSelectCategory}
                    />
                    <div className="px-6 py-2 text-sm rounded-full font-medium border peer-checked:bg-fuchsia-800 peer-checked:text-white">
                      Personal
                    </div>
                  </label>
                </div>
                {errors.taskCategory && (
                  <p className="mt-1 text-[.7rem] text-red-600">
                    {errors.taskCategory}
                  </p>
                )}
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
                    name="dueDate"
                  />
                  {/* <input
                        required
                        className="border border-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-50 w-full px-3 py-1.5 placeholder:text-sm"
                        placeholder="DD/MM/YYYY"
                        /> */}
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-700 h-5 w-5" />
                </div>
                {errors.dueDate && (
                  <p className="mt-1 text-[.7rem] text-red-600">
                    {errors.dueDate}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="w-[220.5px] lg:w-auto">
                <div className="text-sm text-neutral-500 mb-2">
                  Task status*
                </div>
                <div className="grid">
                  <ChevronDown className="pointer-events-none z-10 right-[.5rem] text-neutral-700 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden" />
                  <select
                    name="taskStatus"
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
                  {errors.taskStatus && (
                    <p className="mt-1 text-[.7rem] text-red-600">
                      {errors.taskStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div
              className={`${
                imagePreview || editTodo?.attachmentUrl !== null
                  ? ""
                  : " lg:mb-20 mb-8"
              }`}
            >
              <div className="text-sm text-neutral-500 mb-2">Attachment</div>
              <label
                htmlFor="fileUploadAttachment"
                className="w-full border border-neutral-300 text-neutral-500 rounded-lg bg-neutral-50 px-3 py-2 flex justify-center cursor-pointer"
              >
                <span>
                  Drop your files here or{" "}
                  <span className="text-indigo-600 underline hover:text-indigo-500">
                    Upload
                  </span>
                </span>
              </label>
              <input
                className="hidden"
                id="fileUploadAttachment"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={handleFileInputChange}
              />
              {/* Image Preview */}
              {imagePreview ? (
                <div className="mt-4 relative w-fit">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-80 rounded-md shadow-md"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="absolute top-[-0.5rem] right-[-0.5rem] bg-white text-black border rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={removeImagePreview}
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (fileUpload && <div className="flex px-4 py-2 mt-2 border rounded-lg justify-between">
                            {fileUpload.fileName}
                            <X onClick={() => setFileUpload(null)}/>
                            </div>)}

              {/* Db Image */}
              {(editTodo?.attachmentUrl && (editTodo?.attachmentUrl.includes('.jpg') || editTodo?.attachmentUrl.includes('.jpeg') || editTodo?.attachmentUrl.includes('.png'))) ? (
                <div className="mt-4 relative w-fit">
                  <img
                    src={editTodo.attachmentUrl}
                    alt="uploaded attachment"
                    className="w-80 rounded-md shadow-md"
                  />

                  {/* Remove attachment from edit */}
                  <button
                    type="button"
                    className="absolute top-[-0.5rem] right-[-0.5rem] bg-white text-black border rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={removeCurrentAttachment}
                  >
                    <X size={17} />
                  </button>
                </div>
              ) : (editTodo?.attachmentUrl && <div className="flex px-4 py-2 mt-2 border rounded-lg justify-between">
                {editTodo.attachment}
                <X onClick={removeCurrentAttachment}/>
                </div>)}
            </div>
          </div>

          {/* Activity Log */}
          <div
            className={`${
              windowSize.width < 1024
                ? activeTab === "activity"
                  ? "lg:flex flex-1 overflow-auto"
                  : "hidden"
                : "lg:flex"
            } flex-col col-span-2 lg:bg-neutral-100 border-l-[1px] border-neutral-300`}
          >
            <div
              className={`hidden lg:block bg-white p-4 text-neutral-600 border-b-[1px] border-neutral-300`}
            >
              Activity
            </div>
            <div className="flex flex-col space-y-2 pt-4 flex-1 overflow-y-auto">
              {editTodo.historyActivity.map(
                (activity: { status: string; at: Date }, index) => (
                  <div
                    className="flex justify-between px-4 text-neutral-600 text-xs"
                    key={index}
                  >
                    <div className="w-[75%]">{activity.status}</div>
                    <div>{`${moment(activity.at).format("D MMM")} at ${moment(activity.at).format("h.mm a")}`}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div
          className={`${
            windowSize.width < 1024
              ? activeTab === "activity"
                ? "hidden"
                : ""
              : "block"
          } px-4 py-4 rounded-2xl rounded-tl-none rounded-tr-none flex justify-end space-x-2 bg-neutral-100 border-t border-neutral-300`}
        >
          <button
            onClick={() => closeAndResetForm()}
            className="text-sm px-4 py-1 uppercase rounded-full border border-neutral-300 bg-white"
          >
            cancel
          </button>
          <button
            type="submit"
            className="text-sm px-4 py-1 uppercase bg-fuchsia-600 text-white rounded-full"
          >
            Update
          </button>
        </div>
      </div>
    </Form>
  );
}

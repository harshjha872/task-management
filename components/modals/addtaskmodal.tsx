import React, { useState } from "react";
import { X } from "lucide-react";
import { ChevronDown, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import { addTodo } from "@/store/todoSlice";
import { useAppDispatch } from "@/store/hooks";
import "react-datepicker/dist/react-datepicker.css";
import { Todo, iTodo } from "@/lib/Todo/Todo";
import Form from "next/form";
import { TaskFormData, taskSchema } from "@/lib/utils/schema";
import { removeSpaceFromFileName } from "@/lib/utils/utils";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context/auth-context";

const Addtaskmodal = ({ closeModal }: { closeModal: () => void }) => {
  const [newTodo, setNewTodo] = useState<iTodo | null>(null);
  const [fileUpload, setFileUpload] = useState<{
    fileName: string;
    file: File;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState(null as any);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const { user } = useAuth() as any;
  const dispatch = useAppDispatch();

  const closeAndResetForm = () => {
    closeModal();
    setNewTodo(null);
    removeImagePreview()
  };

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

  const handleSubmit = async (formData: FormData) => {
    const data = Object.fromEntries(formData) as unknown as TaskFormData;
    if (validateForm(data)) {
      if (newTodo) {
        const newTodoObj = new Todo(newTodo);
        if (user) {
          await newTodoObj.uploadDataToFirebase(
            user?.email,
            fileUpload ?? undefined
          );
        }
        dispatch(addTodo(JSON.parse(JSON.stringify(newTodoObj))));
      }
      closeAndResetForm();
    }
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


    setFileUpload({ file: file, fileName: removeSpaceFromFileName(file.name) });
  }

  const removeImagePreview = () => {
    setImagePreview(null);
    setFileUpload(null);
  };

  const handleSetDate = (date: any) => {
    setNewTodo(
      (pre) =>
        ({
          ...pre,
          dueDate: new Date(date),
        } as iTodo)
    );
  };

  const handleSelectCategory = (e: any) => {
    setNewTodo(
      (pre) =>
        ({
          ...pre,
          taskCategory: e.target.value,
        } as iTodo)
    );
  };

  const handleTaskNameChange = (e: any) => {
    setNewTodo(
      (pre) =>
        ({
          ...pre,
          taskName: e.target.value || "",
        } as iTodo)
    );
  };

  const handleTaskDescriptionChange = (e: any) => {
    setNewTodo(
      (pre) =>
        ({
          ...pre,
          taskDescription: e.target.value || "",
        } as iTodo)
    );
  };

  const handleStatusChange = (e: any) => {
    setNewTodo(
      (pre) =>
        ({
          ...pre,
          taskStatus: e.target.value,
        } as iTodo)
    );
  };


  return (
    <Form
      action={handleSubmit}
      className="fixed inset-0 z-50 flex lg:items-center items-end justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-br-none rounded-bl-none rounded-tr-2xl rounded-tl-2xl lg:rounded-2xl shadow-lg flex flex-col max-h-[650px] lg:h-auto overflow-auto lg:w-[42rem] w-full">
        <div className="flex justify-between items-center border-b py-5 px-4">
          <h2 className="text-xl">Create task</h2>
          <button
            onClick={() => closeAndResetForm()}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>

        <div className="px-4 py-3 grid gap-3 flex-1">
          {/* Task title */}
          <div>
            <input
              className="border border-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-50 w-full px-3 py-1.5 placeholder:text-sm"
              placeholder="Task title"
              value={newTodo?.taskName || ""}
              onChange={handleTaskNameChange}
              id="taskName"
              name="taskName"
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
              value={newTodo?.taskDescription || ""}
              onChange={handleTaskDescriptionChange}
            />
          </div>

          {/* Category, date and status */}
          <div className="flex flex-wrap lg:grid lg:grid-cols-3 gap-3">
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
                    defaultChecked={newTodo?.taskCategory === 'work'}
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
                    defaultChecked={newTodo?.taskCategory === 'personal'}
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
                  selected={newTodo?.dueDate}
                  name="dueDate"
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
              {errors.dueDate && (
                <p className="mt-1 text-[.7rem] text-red-600">
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="w-[220.5px] lg:w-auto">
              <div className="text-sm text-neutral-500 mb-2">Task status*</div>
              <div className="grid">
                <ChevronDown className="pointer-events-none z-10 right-[.5rem] text-neutral-700 relative col-start-1 row-start-1 h-4 w-4 self-center justify-self-end forced-colors:hidden" />
                <select
                  name="taskStatus"
                  id="taskStatus"
                  value={newTodo?.taskStatus}
                  className="row-start-1 col-start-1 bg-neutral-50 border border-neutral-300 text-neutral-500 text-sm rounded-lg focus:ring-neutral-300 focus:border-neutral-300 block w-full p-[.58rem] pr-[2.5rem] appearance-none placeholder:text-sm"
                  onChange={handleStatusChange}
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
          <div className={`${imagePreview ? "" : " lg:mb-20 mb-8"}`}>
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
            type="submit"
            className="text-sm px-4 py-1 uppercase bg-fuchsia-600 text-white rounded-full"
          >
            create
          </button>
        </div>
      </div>
    </Form>
  );
};

export default Addtaskmodal;

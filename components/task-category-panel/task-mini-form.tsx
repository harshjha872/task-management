import { Todo } from "@/lib/Todo/Todo";
import moment from "moment";
import { Plus, Calendar, CornerDownLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CustomMenu from "../dropdown/dropdown";
import { useAuth } from "@/lib/auth-context/auth-context";
import Form from "next/form";
import { z } from "zod";
import { TaskFormData, taskSchema } from "@/lib/utils/schema";
import { iTodo } from "@/lib/Todo/Todo";
import DatePicker from "react-datepicker";
import { useAppDispatch } from "@/store/hooks";
import { addTodo } from "@/store/todoSlice";

export default function TaskMiniForm({ closeForm }: { closeForm: () => void }) {
  const [newTodo, setNewTodo] = useState<iTodo | null>(null);
  const { user } = useAuth() as any;
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  const dispatch = useAppDispatch();
  const validateForm = (data: TaskFormData) => {
    try {
      taskSchema.parse({ ...newTodo, dueDate: newTodo?.dueDate.toString() });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<TaskFormData>);
      }
      return false;
    }
  };

  const closeFormAndReset = () => {
    closeForm();
    setNewTodo(null);
  };

  const submitAddTaskFromMiniForm = async (formData: FormData) => {
    const data = Object.fromEntries(formData) as unknown as TaskFormData;
    if (validateForm(data)) {
      if (newTodo) {
        const newTodoObj = new Todo(newTodo);
        if (user) {
          await newTodoObj.uploadDataToFirebase(user?.email, undefined);
        }
        dispatch(addTodo(JSON.parse(JSON.stringify(newTodoObj))));
      }
      closeFormAndReset();
    }
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

  const handleSelectCategory = (category: string) => {
    setNewTodo(
      (pre) =>
        ({
          ...pre,
          taskCategory: category,
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

  const handleStatusChange = (status: any) => {
    setNewTodo(
      (pre) =>
        ({
          ...pre,
          taskStatus: status,
        } as iTodo)
    );
  };

  const changeStatus = [
    {
      label: "TODO",
      onClick: () => handleStatusChange("todo"),
    },
    {
      label: "IN-PROGRESS",
      onClick: () => handleStatusChange("inprogress"),
    },
    {
      label: "COMPLETED",
      onClick: () => handleStatusChange("completed"),
    },
  ];

  const changeCategory = [
    {
      label: "WORK",
      onClick: () => handleSelectCategory("work"),
    },
    {
      label: "PERSONAL",
      onClick: () => handleSelectCategory("personal"),
    },
  ];

  console.log(newTodo);

  return (
    <Form
      action={submitAddTaskFromMiniForm}
      className="flex flex-col bg-neutral-50"
    >
      <div className="grid lg:grid-cols-5 px-6 py-2">
        <div className="lg:col-span-2 flex items-center gap-3">
          <label className="flex items-center justify-center w-5 h-5 rounded cursor-pointer">
            <input type="checkbox" className="hidden" />
            <div className="w-4 h-4"></div>
          </label>
          <div className="w-6 h-6 text-gray-400 " />
          <input
            className="py-2 pl-6 focus:border-none focus:outline-none bg-neutral-50"
            type="text"
            value={newTodo?.taskName || ""}
            placeholder="Task title"
            onChange={handleTaskNameChange}
          />
        </div>
        <div className="flex ">
          <div className="flex items-center justify-center ">
            {newTodo?.dueDate ? (
              <div>{moment(newTodo?.dueDate).format("D MMM, YYYY")}</div>
            ) : (
              <div className="relative">
                <DatePicker
                  wrapperClassName="datePickerMini hidden"
                  selected={newTodo?.dueDate}
                  name="dueDate"
                  placeholderText="Add Date"
                  onChange={handleSetDate}
                />
                {/* <input
                            required
                            className="border border-neutral-300 placeholder:text-neutral-500 rounded-lg bg-neutral-50 w-full px-3 py-1.5 placeholder:text-sm"
                            placeholder="DD/MM/YYYY"
                          /> */}
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-700 h-5 w-5" />
              </div>
            )}
          </div>
        </div>
        <div>
          <CustomMenu items={changeStatus}>
            {newTodo?.taskStatus ? (
              <div className="bg-neutral-200 text-black rounded-md px-3 py-1 w-fit text-sm uppercase">
                {newTodo?.taskStatus}
              </div>
            ) : (
              <div className="rounded-full border text-black  w-10 h-10 flex items-center justify-center text-sm uppercase">
                <Plus size={18} />
              </div>
            )}
          </CustomMenu>
        </div>
        <div>
          <CustomMenu items={changeCategory}>
            {newTodo?.taskCategory ? (
              <div className="">{newTodo?.taskCategory}</div>
            ) : (
              <div className="rounded-full border text-black  w-10 h-10 flex items-center justify-center text-sm uppercase">
                <Plus size={18} />
              </div>
            )}
          </CustomMenu>
        </div>
      </div>
      <div className="grid lg:grid-cols-5 px-6 py-2 border-b">
        <div className="lg:col-span-2 flex items-center gap-3">
          <label className="flex items-center justify-center w-5 h-5 rounded cursor-pointer">
            <input type="checkbox" className="hidden" />
            <div className="w-4 h-4"></div>
          </label>
          <div className="w-6 h-6 text-gray-400 " />
          <button
            type="submit"
            className="ml-6 px-3 bg-fuchsia-800 flex rounded-full py-1 text-white items-center justify-center"
          >
            <span>Add</span>
            <CornerDownLeft size={20} color="white" className="pl-2" />
          </button>
          <button
            onClick={() => closeFormAndReset()}
            className="ml-3 uppercase"
          >
            cancel
          </button>
        </div>
      </div>
    </Form>
  );
}

const DueDate = ({ dueDate }: { dueDate: Date }) => {
  return <div>{dueDate.toString()}</div>;
};

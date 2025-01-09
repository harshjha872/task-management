import { useState } from "react";
import { ChevronUp, CircleCheck } from "lucide-react";

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const Accordian = ({
  title,
  header_color,
  Tasks,
}: {
  title: string;
  header_color: string;
  Tasks: Array<TodoItem>;
}) => {
  console.log(Tasks);
  const [isOpen, setIsOpen] = useState(true);
  const [todos] = useState<TodoItem[]>([
    {
      id: "1",
      text: "Interview with Design Team",
      completed: false,
    },
    {
      id: "2",
      text: "Team Meeting",
      completed: false,
    },
    {
      id: "3",
      text: "Design a Dashboard page along...",
      completed: false,
    },
  ]);
  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between  px-6 py-4 rounded-t-xl transition-colors ${header_color}`}
      >
        <span className="text-2xl">
          {title} ({todos.length})
        </span>
        <ChevronUp
          className={`w-6 h-6 transition-transform duration-200 ${
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
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-3 px-6 py-4">
              <label className="flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {}}
                  className="hidden"
                />
                {todo.completed && (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </label>
              <CircleCheck className="w-6 h-6 text-gray-400" />
              <span className="text-lg">{todo.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accordian;

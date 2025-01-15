import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "@/lib/Todo/Todo";
import { iTodo } from "@/lib/Todo/Todo";
import {
  arrayMove,
} from '@dnd-kit/sortable';

// Define a type for the slice state
export interface todoState {
  tasks: Array<iTodo>;
}

// Define the initial state using that type
const initialState = {
  tasks: [],
} as todoState;

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTasksFromDb(state, action) {
      state.tasks = action.payload
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.tasks.push(action.payload);
    },
    editSingleTodo(state, action: PayloadAction<Todo>) {
      const makeObj = new Todo(action.payload)
      state.tasks = state.tasks.map((task) =>
        task.id === action.payload.id
          ? JSON.parse(JSON.stringify(makeObj))
          : task
      );
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(tasks => tasks.id !== action.payload)
    },
    updateStatusSingleInStore(state, action) {
      state.tasks = state.tasks.map(task => task.id === action.payload.id ? {...task, taskStatus: action.payload.updateTo} : task)
    },
    reorderTasks(state, action) {
      const unFiltered = state.tasks.filter(task => task.taskStatus !== action.payload[0].taskStatus);
      state.tasks = [...unFiltered, ...action.payload]
    },
    updateStatusMulitpleInStore(state, action) {
      state.tasks = state.tasks.map(task => action.payload.ids.includes(task.docId) ? {...task, taskStatus:action.payload.status} : task)
    },
    deleteMultipleInStore(state, action) {
      state.tasks = state.tasks.filter(task => !action.payload.includes(task.docId))
    },
    updateTaskStatus: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        task.taskStatus = newStatus;
      }
    },
    reorderTasksKanban: (state, action) => {
      const { status, oldIndex, newIndex } = action.payload;
      const tasksInColumn = state.tasks.filter(task => task.taskStatus === status);
      const reorderedTasks = arrayMove(tasksInColumn, oldIndex, newIndex);
      const tasksInOtherColumns = state.tasks.filter(task => task.taskStatus !== status);
      state.tasks = [...tasksInOtherColumns, ...reorderedTasks];
    }
  },
});

export const { addTodo, editSingleTodo, reorderTasks, updateTaskStatus, reorderTasksKanban, setTasksFromDb, deleteTask, updateStatusSingleInStore, updateStatusMulitpleInStore, deleteMultipleInStore } = todoSlice.actions;

export default todoSlice.reducer;

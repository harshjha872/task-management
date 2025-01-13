import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "@/lib/Todo/Todo";
import { iTodo } from "@/lib/Todo/Todo";
import {
  arrayMove,
} from '@dnd-kit/sortable';

// Define a type for the slice state
export interface todoState {
  tasks: Array<Todo>;
}

// Define the initial state using that type
const initialState = {
  tasks: [],
} as todoState;

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<Todo>) {
      state.tasks.push(action.payload);
    },
    editSingleTodo(state, action: PayloadAction<iTodo>) {
      const makeObj = new Todo(action.payload)
      makeObj.updateHistoryActivity(
        JSON.parse(
          JSON.stringify(
            state.tasks.find((task: Todo) => task.id === action.payload.id)
          )
        )
      );
      state.tasks = state.tasks.map((task: Todo) =>
        task.id === action.payload.id
          ? JSON.parse(JSON.stringify(makeObj))
          : task
      );
    },
    reorderTasks(state, action: PayloadAction<{oldIndex: number, newIndex: number}>) {
      const { oldIndex, newIndex } = action.payload;
      const movedItem = state.tasks.splice(oldIndex, 1)[0];
      state.tasks.splice(newIndex, 0, movedItem);
    },
    markMultiple(state, action: PayloadAction<Array<Todo>>) {},
    deleteMultiple(state, action: PayloadAction<Array<Todo>>) {},
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

export const { addTodo, editSingleTodo, reorderTasks, updateTaskStatus, reorderTasksKanban } = todoSlice.actions;

export default todoSlice.reducer;

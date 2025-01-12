import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "@/lib/Todo/Todo";
import { iTodo } from "@/lib/Todo/Todo";

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
    markMultiple(state, action: PayloadAction<Array<Todo>>) {},
    deleteMultiple(state, action: PayloadAction<Array<Todo>>) {},
    // addproduct: (state, action: PayloadAction<singleProduct>) => {
    //   const isProductExist = state.products.find(
    //     (product) => product.id === action.payload.id
    //   );
    //   if (isProductExist) isProductExist.quantity += 1;
    //   else state.products.push(action.payload);
    // },
  },
});

export const { addTodo, editSingleTodo } = todoSlice.actions;

export default todoSlice.reducer;

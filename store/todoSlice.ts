import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface iTodo {
  id: number;
  taskName: string;
  taskDescription: string;
  dueDate: Date;
  taskCategory: 'work'|'personal';
  taskStatus: 'todo'|'inprogress'|'completed';
  historyActivity: Array<string>;
  attachment?: any;
}

// Define a type for the slice state
export interface todoState {
  tasks: Array<iTodo>;
}

// Define the initial state using that type
const initialState = {
  tasks: [],
} as todoState;

export const todoSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<iTodo>) {
      state.tasks.push(action.payload)
    },
    markMultiple(state, action: PayloadAction<Array<iTodo>>) {

    },
    deleteMultiple(state, action: PayloadAction<Array<iTodo>>) {

    }
    // addproduct: (state, action: PayloadAction<singleProduct>) => {
    //   const isProductExist = state.products.find(
    //     (product) => product.id === action.payload.id
    //   );
    //   if (isProductExist) isProductExist.quantity += 1;
    //   else state.products.push(action.payload);
    // },
    
  },
});

export const {
    addTodo
} = todoSlice.actions;

export default todoSlice.reducer;

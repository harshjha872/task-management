import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface singleProduct {
//   id: number;
//   productImage: string;
//   productName: string;
//   productDescription: string;
//   productPrice: number;
//   totalPrice: number;
//   quantity: number;
// }

// Define a type for the slice state
export interface productState {
//   products: Array<singleProduct>;
  counter: number
}

// Define the initial state using that type
const initialState = {
//   products: [],
  counter: 0
} as productState;

export const todoSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increaseCounter: (state) => {
        state.counter++
    },
    decreaseCounter: (state) => {
        state.counter--
    },
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
    increaseCounter,
    decreaseCounter,
} = todoSlice.actions;

export default todoSlice.reducer;

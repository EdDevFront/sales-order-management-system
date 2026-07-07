import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as actions from "./ordersActions";

interface OrdersState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrdersState = {
  loading: false,
  error: null,
  successMessage: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearNotification(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Requests
      .addMatcher(
        (action) => action.type.endsWith("Request"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.successMessage = null;
        }
      )
      // Successes
      .addMatcher(
        (action) => action.type.endsWith("Success"),
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = null;
          if (action.type.includes("createOrder")) {
            state.successMessage = "Sales Order created successfully!";
          } else if (action.type.includes("updateStatus")) {
            state.successMessage = "Order status updated successfully!";
          } else if (action.type.includes("updateDelivery")) {
            state.successMessage = "Delivery scheduled successfully!";
          } else if (action.type.includes("updateTransport")) {
            state.successMessage = "Transport type updated successfully!";
          }
        }
      )
      // Failures
      .addMatcher(
        (action) => action.type.endsWith("Failure"),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
          state.successMessage = null;
        }
      );
  },
});

export const { clearNotification } = ordersSlice.actions;
export default ordersSlice.reducer;

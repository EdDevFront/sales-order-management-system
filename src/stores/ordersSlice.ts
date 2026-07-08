import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    setNotification(
      state,
      action: PayloadAction<{ success?: string | null; error?: string | null }>,
    ) {
      state.error = action.payload.error || null;
      state.successMessage = action.payload.success || null;
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
        },
      )
      // Successes
      .addMatcher(
        (action) => action.type.endsWith("Success"),
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = null;
          if (action.type.includes("createOrder")) {
            state.successMessage = "Pedido de Venda criado com sucesso!";
          } else if (action.type.includes("updateStatus")) {
            state.successMessage = "Status do pedido atualizado com sucesso!";
          } else if (action.type.includes("updateDelivery")) {
            state.successMessage = "Entrega agendada com sucesso!";
          } else if (action.type.includes("updateTransport")) {
            state.successMessage = "Tipo de transporte atualizado com sucesso!";
          }
        },
      )
      // Failures
      .addMatcher(
        (action) => action.type.endsWith("Failure"),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
          state.successMessage = null;
        },
      );
  },
});

export const { clearNotification, setNotification } = ordersSlice.actions;
export default ordersSlice.reducer;

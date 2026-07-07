import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  activeTab: string;
  selectedOrderId: string | null;
  filters: {
    status: string;
    clientId: string;
    transportType: string;
    date: string;
  };
}

const initialState: UiState = {
  activeTab: "dashboard",
  selectedOrderId: null,
  filters: {
    status: "ALL",
    clientId: "ALL",
    transportType: "ALL",
    date: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
    setSelectedOrderId(state, action: PayloadAction<string | null>) {
      state.selectedOrderId = action.payload;
    },
    setFilter(
      state,
      action: PayloadAction<{ key: keyof UiState["filters"]; value: string }>
    ) {
      state.filters[action.payload.key] = action.payload.value;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const { setActiveTab, setSelectedOrderId, setFilter, resetFilters } =
  uiSlice.actions;

export default uiSlice.reducer;

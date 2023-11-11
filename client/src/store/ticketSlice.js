import { createSlice } from "@reduxjs/toolkit";
const TicketSlice = createSlice({
  name: "tickets",
  initialState: { tickets: [] },
  reducers: {
    setTickets(state, action) {
      state.tickets = action.payload;
    },
  },
});

export default TicketSlice;

export const ticketAction = TicketSlice.actions;

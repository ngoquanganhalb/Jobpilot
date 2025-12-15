import { NotificationResponse } from "@/dtos/notification/NotificationResponse";
import { createSlice } from "@reduxjs/toolkit";


interface NotificationState {
  list: NotificationResponse[];
  unreadCount: number;
}

const initialState: NotificationState = {
  list: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.list = action.payload;
      state.unreadCount = action.payload.filter((n:any) => !n.read).length;
    },
    addNotification(state, action) {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead(state, action) {
      const n = state.list.find((i) => i.id === action.payload);
      if (n && !n.read) {
        n.read = true;
        state.unreadCount -= 1;
      }
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;

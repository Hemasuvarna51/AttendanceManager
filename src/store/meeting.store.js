import { create } from "zustand";

export const useMeetingStore = create((set) => ({
  meetings: [],

  addMeeting: (meeting) =>
    set((state) => ({
      meetings: [...state.meetings, meeting],
    })),

  deleteMeeting: (index) =>
    set((state) => ({
      meetings: state.meetings.filter((_, i) => i !== index),
    })),
}));

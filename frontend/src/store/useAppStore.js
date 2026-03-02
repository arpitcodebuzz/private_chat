import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  user: { nickname: "" },
  room: { roomId: "", roomName: "" },
  messages: [],
  typing: { isTyping: false, who: "" },
  socket: null,

  setNickname: (nickname) => set((s) => ({ user: { ...s.user, nickname } })),
  setRoom: (roomId, roomName) => set({ room: { roomId, roomName } }),

  setSocket: (socket) => set({ socket }),

  setMessages: (messages) => set({ messages }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  setTyping: (isTyping, who = "") => set({ typing: { isTyping, who } }),

  resetChat: () =>
    set({
      room: { roomId: "", roomName: "" },
      messages: [],
      typing: { isTyping: false, who: "" },
      socket: null,
    }),

  disconnectSocket: () => {
    const sock = get().socket;
    if (sock) sock.disconnect();
    set({ socket: null });
  },
}));
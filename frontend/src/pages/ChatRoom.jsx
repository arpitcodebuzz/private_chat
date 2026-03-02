import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../utils/api";
import { createSocket } from "../utils/socket";
import { useAppStore } from "../store/useAppStore";
import useSessionLock from "../hooks/useSessionLock";

export default function ChatRoom() {
  useSessionLock(true);

  const { roomId } = useParams();
  const nav = useNavigate();

  const nickname = useAppStore((s) => s.user.nickname);
  const roomName = useAppStore((s) => s.room.roomName);

  const setSocket = useAppStore((s) => s.setSocket);
  const socket = useAppStore((s) => s.socket);

  const messages = useAppStore((s) => s.messages);
  const setMessages = useAppStore((s) => s.setMessages);
  const addMessage = useAppStore((s) => s.addMessage);

  const typing = useAppStore((s) => s.typing);
  const setTyping = useAppStore((s) => s.setTyping);

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const listRef = useRef(null);

  const canUse = useMemo(() => Boolean(roomId && nickname), [roomId, nickname]);

  useEffect(() => {
    if (!canUse) {
      nav("/", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await apiGet(`/api/rooms/${roomId}/messages?limit=120`);
        setMessages(res.data || []);
      } catch (e) {
        setStatus(e.message);
      }
    })();
  }, [canUse, roomId, nav, setMessages]);

  useEffect(() => {
    if (!canUse) return;

    const s = createSocket();
    setSocket(s);

    s.on("connect", () => setStatus(""));
    s.on("room_full", (p) => {
      setStatus(p?.message || "Room full");
      s.disconnect();
    });

    s.on("message", (msg) => addMessage(msg));
    s.on("typing", (p) => setTyping(true, p?.displayName || "Friend"));
    s.on("stop_typing", () => setTyping(false, ""));

    s.on("user_joined", (p) => setStatus(`${p?.displayName || "Friend"} joined`));
    s.on("user_left", (p) => setStatus(`${p?.displayName || "Friend"} left`));

    s.emit("join_room", { roomId, displayName: nickname });

    return () => {
      s.disconnect();
      setSocket(null);
      setTyping(false, "");
    };
  }, [canUse, roomId, nickname, addMessage, setSocket, setTyping]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, typing.isTyping]);

  const send = () => {
    const t = text.trim();
    if (!t || !socket) return;
    socket.emit("new_message", { roomId, text: t });
    setText("");
    socket.emit("stop_typing", { roomId });
  };

  const onChange = (v) => {
    setText(v);
    if (!socket) return;
    if (v.trim().length) socket.emit("typing", { roomId });
    else socket.emit("stop_typing", { roomId });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={() => nav("/", { replace: true })}
          className="rounded-xl border border-white/10 px-3 py-1.5 text-sm"
        >
          Back
        </button>

        <div className="text-sm text-white/70">{roomName ? roomName : "Chat"}</div>
        <div className="text-xs text-white/50">{status}</div>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {messages.map((m) => {
          const mine = m.senderName === nickname;
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={[
                  "max-w-[80%] rounded-2xl px-3 py-2 border",
                  mine
                    ? "bg-emerald-200 text-neutral-950 border-emerald-200"
                    : "bg-white text-neutral-950 border-white/40",
                ].join(" ")}
              >
                <div className="text-[13px] leading-snug whitespace-pre-wrap break-words">
                  {m.text}
                </div>
                <div className="text-[10px] opacity-60 mt-1 text-right">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {typing.isTyping ? (
          <div className="text-xs text-white/60 px-1">{typing.who} is typing...</div>
        ) : null}
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-full bg-neutral-900 border border-white/10 px-4 py-2 outline-none"
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <button
            onClick={send}
            className="rounded-full bg-white text-neutral-950 px-4 py-2 font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
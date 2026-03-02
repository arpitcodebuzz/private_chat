import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export default function useSessionLock(enabled = true) {
  const navigate = useNavigate();
  const resetChat = useAppStore((s) => s.resetChat);
  const disconnectSocket = useAppStore((s) => s.disconnectSocket);

  // before the patch we immediately reacted to any blur:
//    window.addEventListener("blur", lock);
// after the patch we hold off for half a second:

let ignore = true;
const timer = setTimeout(() => (ignore = false), 500);


  useEffect(() => {
    if (ignore) return;
    if (!enabled) return;

    const lock = () => {
      disconnectSocket();
      resetChat();
      try {
        sessionStorage.clear();
      } catch {}
      navigate("/", { replace: true });
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") lock();
    };

    window.addEventListener("blur", lock);
    window.addEventListener("pagehide", lock);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("blur", lock);
      window.removeEventListener("pagehide", lock);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, navigate, resetChat, disconnectSocket]);
}
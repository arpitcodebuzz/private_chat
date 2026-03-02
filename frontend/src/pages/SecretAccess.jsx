import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SecretAccess() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    const ok = pwd === import.meta.env.VITE_ACCESS_PASSWORD;
    if (!ok) {
      setErr("Wrong access password");
      setPwd("");
      return;
    }
    nav("/join");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-5 bg-white/5 border border-white/10">
        <div className="text-lg font-semibold">Access</div>
        <div className="text-sm text-white/60 mt-1">Enter access password</div>

        <input
          className="mt-4 w-full rounded-xl bg-neutral-900 border border-white/10 px-3 py-2 outline-none"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          type="password"
          placeholder="••••"
        />

        {err ? <div className="text-sm text-red-400 mt-2">{err}</div> : null}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => nav("/")}
            className="flex-1 rounded-xl border border-white/10 px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="flex-1 rounded-xl bg-white text-neutral-950 px-3 py-2 font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
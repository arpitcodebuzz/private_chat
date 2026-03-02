import { Routes, Route, Navigate } from "react-router-dom";

import BollywoodHome from "./pages/BollywoodHome.jsx";
import SecretAccess from "./pages/SecretAccess.jsx";
import CreateRoom from "./pages/CreateRomm.jsx";
import JoinRoom from "./pages/JoinRoom.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BollywoodHome />} />
      <Route path="/secret" element={<SecretAccess />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/chat/:roomId" element={<ChatRoom />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
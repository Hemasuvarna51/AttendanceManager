import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Navbar
          title="Horilla"
          onMenu={() => setSidebarOpen(true)}
          notificationCount={4}
        />

        <main style={{ flex: 1, padding: 22 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

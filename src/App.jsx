import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f6f7fb",
      }}
    >
      {/* Sidebar (desktop sticky + mobile drawer) */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Area */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <Navbar
          title="Horilla"
          onMenu={() => setSidebarOpen(true)}
          notificationCount={4}
        />

        {/* Page Content */}
        <main style={{ flex: 1, padding: 22 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

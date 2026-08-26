import {
  LayoutDashboard,
  ShieldAlert,
  Boxes,
  FileWarning,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Findings", icon: ShieldAlert, path: "/findings" },
    { label: "Applications", icon: Boxes, path: "/applications" },
    { label: "Exceptions", icon: FileWarning, path: "/exceptions" },
    { label: "Reports", icon: BarChart3, path: "/reports" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      background: "#0b1630",
      color: "white",
      padding: "24px 16px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "30px",
        fontSize: "22px",
        fontWeight: "700",
      }}>
        <ShieldCheck size={28} />
        SecureHub
      </div>

      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "11px 12px",
                borderRadius: "8px",
                textDecoration: "none",
                color: "white",
                background: isActive ? "#24345f" : "transparent",
              })}
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
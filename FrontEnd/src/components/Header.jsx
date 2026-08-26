import { Search, Bell } from "lucide-react";

function Header() {
  return (
    <header
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#f3f4f6",
          padding: "10px 14px",
          borderRadius: "8px",
          width: "320px",
        }}
      >
        <Search size={18} />

        <input
          placeholder="Search findings..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            width: "100%",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <Bell size={20} />

        <div>
          <strong>User name</USER></strong>
          <div style={{ fontSize: "12px", color: "#667085" }}>
            Security Engineer
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
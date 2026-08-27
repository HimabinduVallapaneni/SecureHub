function Header() {
  return (
    <header
      style={{
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
      }}
    >
      <div>
        <strong
          style={{
            fontSize: "16px",
            color: "#101828",
          }}
        >
          SecureHub
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#eef2ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            color: "#4f46e5",
          }}
        >
          U
        </div>

        <div>
          <strong>User</strong>

          <div
            style={{
              fontSize: "12px",
              color: "#667085",
            }}
          >
            Security Engineer
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
import { useState } from "react";

const initialFindings = [
  {
    id: "SH-1001",
    title: "SQL Injection in /api/users",
    application: "SecureHub API",
    severity: "Critical",
    status: "Open",
    owner: "AppSec Team",
  },
  {
    id: "SH-1002",
    title: "Outdated lodash Dependency",
    application: "SecureHub Web",
    severity: "High",
    status: "Open",
    owner: "Frontend Team",
  },
  {
    id: "SH-1003",
    title: "Hardcoded Secret Detected",
    application: "SecureHub API",
    severity: "High",
    status: "Open",
    owner: "Platform Team",
  },
];

function Findings() {
  const [severityFilter, setSeverityFilter] = useState("All");

  const filteredFindings =
    severityFilter === "All"
      ? initialFindings
      : initialFindings.filter(
          (finding) => finding.severity === severityFilter
        );

  return (
    <main className="dashboard">
      <section className="page-heading">
        <div>
          <h1>Security Findings</h1>
          <p>
            Review, prioritize and track application security vulnerabilities.
          </p>
        </div>

        <button className="primary-button">
          + New Finding
        </button>
      </section>

      <div className="findings-toolbar">
        <select
          value={severityFilter}
          onChange={(event) =>
            setSeverityFilter(event.target.value)
          }
        >
          <option>All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <section className="panel">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Finding</th>
                <th>Application</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>

            <tbody>
              {filteredFindings.map((finding) => (
                <tr key={finding.id}>
                  <td>{finding.id}</td>
                  <td>{finding.title}</td>
                  <td>{finding.application}</td>

                  <td>
                    <span
                      className={`badge severity-${finding.severity.toLowerCase()}`}
                    >
                      {finding.severity}
                    </span>
                  </td>

                  <td>
                    <span className="badge status-open">
                      {finding.status}
                    </span>
                  </td>

                  <td>{finding.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Findings;
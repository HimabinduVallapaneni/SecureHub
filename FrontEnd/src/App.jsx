import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";


const API_URL = "http://127.0.0.1:8000";


function Dashboard() {
  const [findings, setFindings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [exceptions, setExceptions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/findings`)
      .then((response) => response.json())
      .then(setFindings)
      .catch(console.error);

    fetch(`${API_URL}/api/applications`)
      .then((response) => response.json())
      .then(setApplications)
      .catch(console.error);

    fetch(`${API_URL}/api/exceptions`)
      .then((response) => response.json())
      .then(setExceptions)
      .catch(console.error);
  }, []);

  const severityCount = (severity) =>
    findings.filter(
      (finding) => finding.severity === severity
    ).length;

  return (
    <main style={{ padding: "30px" }}>
      <h1>Security Dashboard</h1>

      <p style={{ color: "#667085" }}>
        Security posture across registered applications.
      </p>

      <div style={metricGrid}>
        <MetricCard
          label="Applications"
          value={applications.length}
          color="#635bff"
        />

        <MetricCard
          label="Total Findings"
          value={findings.length}
          color="#2563eb"
        />

        <MetricCard
          label="Critical"
          value={severityCount("Critical")}
          color="#dc2626"
        />

        <MetricCard
          label="Active Exceptions"
          value={
            exceptions.filter(
              (item) =>
                item.status === "Approved" ||
                item.status === "Pending"
            ).length
          }
          color="#7c3aed"
        />
      </div>

      <div style={panelStyle}>
        <h2>Recent Findings</h2>

        {findings.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No findings currently available.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeader}>ID</th>
                <th style={tableHeader}>Finding</th>
                <th style={tableHeader}>Application</th>
                <th style={tableHeader}>Severity</th>
                <th style={tableHeader}>Status</th>
              </tr>
            </thead>

            <tbody>
              {findings.slice(0, 5).map((finding) => (
                <tr key={finding.id}>
                  <td style={tableCell}>{finding.id}</td>
                  <td style={tableCell}>{finding.title}</td>
                  <td style={tableCell}>
                    {finding.application}
                  </td>

                  <td style={tableCell}>
                    <SeverityBadge
                      value={finding.severity}
                    />
                  </td>

                  <td style={tableCell}>
                    {finding.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}


function Findings() {
  const [findings, setFindings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingFinding, setEditingFinding] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    finding_id: "",
    title: "",
    application: "",
    severity: "Medium",
    status: "Open",
    owner: "",
  });

  const [updateForm, setUpdateForm] = useState({
    status: "Open",
    remediation_notes: "",
    retest_status: "Not Retested",
  });


  const loadData = async () => {
    try {
      const findingResponse = await fetch(
        `${API_URL}/api/findings`
      );

      const applicationResponse = await fetch(
        `${API_URL}/api/applications`
      );

      setFindings(await findingResponse.json());
      setApplications(
        await applicationResponse.json()
      );
    } catch {
      setError("Unable to load SecureHub data.");
    }
  };


  useEffect(() => {
    loadData();
  }, []);


  const createFinding = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/findings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to create finding"
        );
      }

      setForm({
        finding_id: "",
        title: "",
        application: "",
        severity: "Medium",
        status: "Open",
        owner: "",
      });

      setShowCreate(false);
      setError("");

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };


  const updateFinding = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/findings/${editingFinding.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateForm),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to update finding"
        );
      }

      setEditingFinding(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };


  const deleteFinding = async (id) => {
    if (!window.confirm(`Delete ${id}?`)) {
      return;
    }

    try {
      await fetch(
        `${API_URL}/api/findings/${id}`,
        {
          method: "DELETE",
        }
      );

      await loadData();
    } catch {
      setError("Unable to delete finding.");
    }
  };


  const openEdit = (finding) => {
    setEditingFinding(finding);

    setUpdateForm({
      status: finding.status,
      remediation_notes:
        finding.remediation_notes || "",
      retest_status:
        finding.retest_status || "Not Retested",
    });
  };


  return (
    <main style={{ padding: "30px" }}>
      <div style={pageHeading}>
        <div>
          <h1>Security Findings</h1>

          <p style={{ color: "#667085" }}>
            Track security issues through remediation
            and retesting.
          </p>
        </div>

        <button
          style={primaryButton}
          onClick={() =>
            setShowCreate(!showCreate)
          }
        >
          + New Finding
        </button>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {showCreate && (
        <form
          style={panelStyle}
          onSubmit={createFinding}
        >
          <h2>Create Finding</h2>

          <div style={formGrid}>
            <input
              required
              placeholder="Finding ID"
              value={form.finding_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  finding_id: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              required
              placeholder="Finding title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              style={inputStyle}
            />

            <select
              required
              value={form.application}
              onChange={(e) =>
                setForm({
                  ...form,
                  application: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option value="">
                Select Application
              </option>

              {applications.map((application) => (
                <option
                  key={application.id}
                  value={application.name}
                >
                  {application.name}
                </option>
              ))}
            </select>

            <input
              required
              placeholder="Owner"
              value={form.owner}
              onChange={(e) =>
                setForm({
                  ...form,
                  owner: e.target.value,
                })
              }
              style={inputStyle}
            />

            <select
              value={form.severity}
              onChange={(e) =>
                setForm({
                  ...form,
                  severity: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>

          <button
            type="submit"
            style={successButton}
          >
            Save Finding
          </button>
        </form>
      )}

      {editingFinding && (
        <form
          style={panelStyle}
          onSubmit={updateFinding}
        >
          <h2>
            Update {editingFinding.id}
          </h2>

          <div style={formGrid}>
            <select
              value={updateForm.status}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  status: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

            <select
              value={updateForm.retest_status}
              onChange={(e) =>
                setUpdateForm({
                  ...updateForm,
                  retest_status:
                    e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Not Retested</option>
              <option>Pending</option>
              <option>Passed</option>
              <option>Failed</option>
            </select>
          </div>

          <textarea
            placeholder="Remediation notes"
            value={updateForm.remediation_notes}
            onChange={(e) =>
              setUpdateForm({
                ...updateForm,
                remediation_notes:
                  e.target.value,
              })
            }
            style={{
              ...inputStyle,
              width: "100%",
              minHeight: "100px",
              marginTop: "14px",
            }}
          />

          <button
            type="submit"
            style={successButton}
          >
            Save Changes
          </button>
        </form>
      )}

      <div style={panelStyle}>
        {findings.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No findings available.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeader}>ID</th>
                <th style={tableHeader}>Finding</th>
                <th style={tableHeader}>
                  Application
                </th>
                <th style={tableHeader}>
                  Severity
                </th>
                <th style={tableHeader}>
                  Status
                </th>
                <th style={tableHeader}>
                  Retest
                </th>
                <th style={tableHeader}>
                  Owner
                </th>
                <th style={tableHeader}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {findings.map((finding) => (
                <tr key={finding.id}>
                  <td style={tableCell}>
                    {finding.id}
                  </td>

                  <td style={tableCell}>
                    {finding.title}
                  </td>

                  <td style={tableCell}>
                    {finding.application}
                  </td>

                  <td style={tableCell}>
                    <SeverityBadge
                      value={finding.severity}
                    />
                  </td>

                  <td style={tableCell}>
                    {finding.status}
                  </td>

                  <td style={tableCell}>
                    {finding.retest_status}
                  </td>

                  <td style={tableCell}>
                    {finding.owner}
                  </td>

                  <td style={tableCell}>
                    <button
                      style={editButton}
                      onClick={() =>
                        openEdit(finding)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={deleteButton}
                      onClick={() =>
                        deleteFinding(
                          finding.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}


function Applications() {
  const [applications, setApplications] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    owner: "",
    criticality: "Medium",
    environment: "Development",
    status: "Active",
    description: "",
  });


  const loadApplications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/applications`
      );

      setApplications(
        await response.json()
      );
    } catch {
      setError(
        "Unable to load applications."
      );
    }
  };


  useEffect(() => {
    loadApplications();
  }, []);


  const createApplication = async (
    event
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to create application"
        );
      }

      setForm({
        name: "",
        owner: "",
        criticality: "Medium",
        environment: "Development",
        status: "Active",
        description: "",
      });

      setShowForm(false);
      setError("");

      await loadApplications();
    } catch (err) {
      setError(err.message);
    }
  };


  const deleteApplication = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this application?"
      )
    ) {
      return;
    }

    try {
      await fetch(
        `${API_URL}/api/applications/${id}`,
        {
          method: "DELETE",
        }
      );

      await loadApplications();
    } catch {
      setError(
        "Unable to delete application."
      );
    }
  };


  return (
    <main style={{ padding: "30px" }}>
      <div style={pageHeading}>
        <div>
          <h1>Applications</h1>

          <p style={{ color: "#667085" }}>
            Maintain applications monitored
            by SecureHub.
          </p>
        </div>

        <button
          style={primaryButton}
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          + Register Application
        </button>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {showForm && (
        <form
          style={panelStyle}
          onSubmit={createApplication}
        >
          <h2>Register Application</h2>

          <div style={formGrid}>
            <input
              required
              placeholder="Application name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              required
              placeholder="Application owner"
              value={form.owner}
              onChange={(e) =>
                setForm({
                  ...form,
                  owner: e.target.value,
                })
              }
              style={inputStyle}
            />

            <select
              value={form.criticality}
              onChange={(e) =>
                setForm({
                  ...form,
                  criticality:
                    e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={form.environment}
              onChange={(e) =>
                setForm({
                  ...form,
                  environment:
                    e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Development</option>
              <option>Testing</option>
              <option>Staging</option>
              <option>Production</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Active</option>
              <option>Maintenance</option>
              <option>Retired</option>
            </select>
          </div>

          <textarea
            placeholder="Application description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            style={{
              ...inputStyle,
              width: "100%",
              minHeight: "90px",
              marginTop: "14px",
            }}
          />

          <button
            type="submit"
            style={successButton}
          >
            Save Application
          </button>
        </form>
      )}

      <div style={panelStyle}>
        {applications.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No applications registered.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeader}>
                  Application
                </th>
                <th style={tableHeader}>
                  Owner
                </th>
                <th style={tableHeader}>
                  Criticality
                </th>
                <th style={tableHeader}>
                  Environment
                </th>
                <th style={tableHeader}>
                  Status
                </th>
                <th style={tableHeader}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {applications.map(
                (application) => (
                  <tr key={application.id}>
                    <td style={tableCell}>
                      {application.name}
                    </td>

                    <td style={tableCell}>
                      {application.owner}
                    </td>

                    <td style={tableCell}>
                      <SeverityBadge
                        value={
                          application.criticality
                        }
                      />
                    </td>

                    <td style={tableCell}>
                      {
                        application.environment
                      }
                    </td>

                    <td style={tableCell}>
                      {application.status}
                    </td>

                    <td style={tableCell}>
                      <button
                        style={
                          deleteButton
                        }
                        onClick={() =>
                          deleteApplication(
                            application.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}


function Exceptions() {
  const [exceptions, setExceptions] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [findings, setFindings] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    exception_id: "",
    application: "",
    finding_id: "",
    owner: "",
    reason: "",
    expiration_date: "",
    status: "Pending",
  });


  const loadData = async () => {
    try {
      const exceptionResponse =
        await fetch(
          `${API_URL}/api/exceptions`
        );

      const applicationResponse =
        await fetch(
          `${API_URL}/api/applications`
        );

      const findingResponse =
        await fetch(
          `${API_URL}/api/findings`
        );

      setExceptions(
        await exceptionResponse.json()
      );

      setApplications(
        await applicationResponse.json()
      );

      setFindings(
        await findingResponse.json()
      );
    } catch {
      setError(
        "Unable to load exception data."
      );
    }
  };


  useEffect(() => {
    loadData();
  }, []);


  const createException = async (
    event
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/exceptions`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to create exception"
        );
      }

      setForm({
        exception_id: "",
        application: "",
        finding_id: "",
        owner: "",
        reason: "",
        expiration_date: "",
        status: "Pending",
      });

      setShowForm(false);
      setError("");

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };


  const updateStatus = async (
    exceptionId,
    newStatus
  ) => {
    try {
      await fetch(
        `${API_URL}/api/exceptions/${exceptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      await loadData();
    } catch {
      setError(
        "Unable to update exception."
      );
    }
  };


  const deleteException = async (
    id
  ) => {
    if (
      !window.confirm(
        `Delete exception ${id}?`
      )
    ) {
      return;
    }

    try {
      await fetch(
        `${API_URL}/api/exceptions/${id}`,
        {
          method: "DELETE",
        }
      );

      await loadData();
    } catch {
      setError(
        "Unable to delete exception."
      );
    }
  };


  return (
    <main style={{ padding: "30px" }}>
      <div style={pageHeading}>
        <div>
          <h1>Security Exceptions</h1>

          <p style={{ color: "#667085" }}>
            Track approved and pending
            time-bound security risk
            exceptions.
          </p>
        </div>

        <button
          style={primaryButton}
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          + New Exception
        </button>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {showForm && (
        <form
          style={panelStyle}
          onSubmit={createException}
        >
          <h2>
            Create Security Exception
          </h2>

          <div style={formGrid}>
            <input
              required
              placeholder="Exception ID"
              value={form.exception_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  exception_id:
                    e.target.value,
                })
              }
              style={inputStyle}
            />

            <select
              required
              value={form.application}
              onChange={(e) =>
                setForm({
                  ...form,
                  application:
                    e.target.value,
                })
              }
              style={inputStyle}
            >
              <option value="">
                Select Application
              </option>

              {applications.map(
                (application) => (
                  <option
                    key={application.id}
                    value={
                      application.name
                    }
                  >
                    {application.name}
                  </option>
                )
              )}
            </select>

            <select
              value={form.finding_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  finding_id:
                    e.target.value,
                })
              }
              style={inputStyle}
            >
              <option value="">
                Optional Finding
              </option>

              {findings.map(
                (finding) => (
                  <option
                    key={finding.id}
                    value={finding.id}
                  >
                    {finding.id} -{" "}
                    {finding.title}
                  </option>
                )
              )}
            </select>

            <input
              required
              placeholder="Exception owner"
              value={form.owner}
              onChange={(e) =>
                setForm({
                  ...form,
                  owner: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              required
              type="date"
              value={
                form.expiration_date
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  expiration_date:
                    e.target.value,
                })
              }
              style={inputStyle}
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              style={inputStyle}
            >
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Expired</option>
            </select>
          </div>

          <textarea
            required
            placeholder="Business justification / risk acceptance reason"
            value={form.reason}
            onChange={(e) =>
              setForm({
                ...form,
                reason: e.target.value,
              })
            }
            style={{
              ...inputStyle,
              width: "100%",
              minHeight: "100px",
              marginTop: "14px",
            }}
          />

          <button
            type="submit"
            style={successButton}
          >
            Save Exception
          </button>
        </form>
      )}

      <div style={panelStyle}>
        {exceptions.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No security exceptions
            currently recorded.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeader}>
                  ID
                </th>
                <th style={tableHeader}>
                  Application
                </th>
                <th style={tableHeader}>
                  Finding
                </th>
                <th style={tableHeader}>
                  Owner
                </th>
                <th style={tableHeader}>
                  Expiration
                </th>
                <th style={tableHeader}>
                  Status
                </th>
                <th style={tableHeader}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {exceptions.map(
                (item) => (
                  <tr key={item.id}>
                    <td style={tableCell}>
                      {item.id}
                    </td>

                    <td style={tableCell}>
                      {item.application}
                    </td>

                    <td style={tableCell}>
                      {item.finding_id ||
                        "-"}
                    </td>

                    <td style={tableCell}>
                      {item.owner}
                    </td>

                    <td style={tableCell}>
                      {
                        item.expiration_date
                      }
                    </td>

                    <td style={tableCell}>
                      {item.status}
                    </td>

                    <td style={tableCell}>
                      <select
                        value={
                          item.status
                        }
                        onChange={(e) =>
                          updateStatus(
                            item.id,
                            e.target.value
                          )
                        }
                        style={{
                          ...inputStyle,
                          marginRight:
                            "8px",
                        }}
                      >
                        <option>
                          Pending
                        </option>
                        <option>
                          Approved
                        </option>
                        <option>
                          Rejected
                        </option>
                        <option>
                          Expired
                        </option>
                      </select>

                      <button
                        style={
                          deleteButton
                        }
                        onClick={() =>
                          deleteException(
                            item.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}


function Reports() {
  const [findings, setFindings] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [exceptions, setExceptions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    const loadReports = async () => {
      try {
        const [
          findingsResponse,
          applicationsResponse,
          exceptionsResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/findings`
          ),
          fetch(
            `${API_URL}/api/applications`
          ),
          fetch(
            `${API_URL}/api/exceptions`
          ),
        ]);

        setFindings(
          await findingsResponse.json()
        );

        setApplications(
          await applicationsResponse.json()
        );

        setExceptions(
          await exceptionsResponse.json()
        );
      } catch (error) {
        console.error(
          "Unable to load reports",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);


  const severityCount = (severity) =>
    findings.filter(
      (finding) =>
        finding.severity === severity
    ).length;


  const statusCount = (status) =>
    findings.filter(
      (finding) =>
        finding.status === status
    ).length;


  const retestCount = (status) =>
    findings.filter(
      (finding) =>
        finding.retest_status ===
        status
    ).length;


  const exceptionCount = (status) =>
    exceptions.filter(
      (item) =>
        item.status === status
    ).length;


  if (loading) {
    return (
      <main style={{ padding: "30px" }}>
        <h1>Security Reports</h1>
        <p>Loading report data...</p>
      </main>
    );
  }


  return (
    <main style={{ padding: "30px" }}>
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            marginBottom: "5px",
          }}
        >
          Security Reports
        </h1>

        <p style={{ color: "#667085" }}>
          Current security posture,
          remediation and exception
          metrics.
        </p>
      </div>

      <div style={metricGrid}>
        <MetricCard
          label="Applications"
          value={applications.length}
          color="#635bff"
        />

        <MetricCard
          label="Total Findings"
          value={findings.length}
          color="#2563eb"
        />

        <MetricCard
          label="Open Findings"
          value={statusCount("Open")}
          color="#dc2626"
        />

        <MetricCard
          label="Resolved Findings"
          value={statusCount(
            "Resolved"
          )}
          color="#16a34a"
        />
      </div>

      <div style={reportGrid}>
        <div style={panelStyle}>
          <h2>
            Severity Distribution
          </h2>

          <ReportRow
            label="Critical"
            value={severityCount(
              "Critical"
            )}
          />

          <ReportRow
            label="High"
            value={severityCount(
              "High"
            )}
          />

          <ReportRow
            label="Medium"
            value={severityCount(
              "Medium"
            )}
          />

          <ReportRow
            label="Low"
            value={severityCount(
              "Low"
            )}
          />
        </div>

        <div style={panelStyle}>
          <h2>Remediation Status</h2>

          <ReportRow
            label="Open"
            value={statusCount("Open")}
          />

          <ReportRow
            label="In Progress"
            value={statusCount(
              "In Progress"
            )}
          />

          <ReportRow
            label="Resolved"
            value={statusCount(
              "Resolved"
            )}
          />
        </div>

        <div style={panelStyle}>
          <h2>Retesting</h2>

          <ReportRow
            label="Not Retested"
            value={retestCount(
              "Not Retested"
            )}
          />

          <ReportRow
            label="Pending"
            value={retestCount(
              "Pending"
            )}
          />

          <ReportRow
            label="Passed"
            value={retestCount(
              "Passed"
            )}
          />

          <ReportRow
            label="Failed"
            value={retestCount(
              "Failed"
            )}
          />
        </div>

        <div style={panelStyle}>
          <h2>
            Security Exceptions
          </h2>

          <ReportRow
            label="Pending"
            value={exceptionCount(
              "Pending"
            )}
          />

          <ReportRow
            label="Approved"
            value={exceptionCount(
              "Approved"
            )}
          />

          <ReportRow
            label="Rejected"
            value={exceptionCount(
              "Rejected"
            )}
          />

          <ReportRow
            label="Expired"
            value={exceptionCount(
              "Expired"
            )}
          />
        </div>
      </div>

      <div style={panelStyle}>
        <h2>
          Application Inventory
        </h2>

        {applications.length === 0 ? (
          <p style={{ color: "#667085" }}>
            No applications registered.
          </p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeader}>
                  Application
                </th>
                <th style={tableHeader}>
                  Owner
                </th>
                <th style={tableHeader}>
                  Criticality
                </th>
                <th style={tableHeader}>
                  Environment
                </th>
                <th style={tableHeader}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {applications.map(
                (application) => (
                  <tr key={application.id}>
                    <td style={tableCell}>
                      {application.name}
                    </td>

                    <td style={tableCell}>
                      {application.owner}
                    </td>

                    <td style={tableCell}>
                      <SeverityBadge
                        value={
                          application.criticality
                        }
                      />
                    </td>

                    <td style={tableCell}>
                      {
                        application.environment
                      }
                    </td>

                    <td style={tableCell}>
                      {application.status}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}


function Settings() {
  const [settings, setSettings] =
    useState({
      app_name: "SecureHub",
      default_severity: "Medium",
      default_environment:
        "Development",
      default_exception_days: 30,
    });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Unable to load settings"
          );
        }

        return response.json();
      })
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);


  const saveSettings = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            app_name:
              settings.app_name,

            default_severity:
              settings.default_severity,

            default_environment:
              settings.default_environment,

            default_exception_days:
              Number(
                settings.default_exception_days
              ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to save settings"
        );
      }

      setMessage(
        "SecureHub settings saved successfully."
      );
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <main style={{ padding: "30px" }}>
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1>Settings</h1>

        <p style={{ color: "#667085" }}>
          Configure SecureHub application
          defaults.
        </p>
      </div>

      {message && (
        <div style={successMessageStyle}>
          {message}
        </div>
      )}

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form
        onSubmit={saveSettings}
        style={{
          ...panelStyle,
          maxWidth: "750px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Application Configuration
        </h2>

        <div style={formGrid}>
          <div>
            <label style={labelStyle}>
              Application Name
            </label>

            <input
              value={settings.app_name}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  app_name:
                    event.target.value,
                })
              }
              style={{
                ...inputStyle,
                width: "100%",
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Default Finding Severity
            </label>

            <select
              value={
                settings.default_severity
              }
              onChange={(event) =>
                setSettings({
                  ...settings,
                  default_severity:
                    event.target.value,
                })
              }
              style={{
                ...inputStyle,
                width: "100%",
              }}
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Default Environment
            </label>

            <select
              value={
                settings.default_environment
              }
              onChange={(event) =>
                setSettings({
                  ...settings,
                  default_environment:
                    event.target.value,
                })
              }
              style={{
                ...inputStyle,
                width: "100%",
              }}
            >
              <option>Development</option>
              <option>Testing</option>
              <option>Staging</option>
              <option>Production</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>
              Default Exception Duration
            </label>

            <input
              type="number"
              min="1"
              value={
                settings.default_exception_days
              }
              onChange={(event) =>
                setSettings({
                  ...settings,
                  default_exception_days:
                    event.target.value,
                })
              }
              style={{
                ...inputStyle,
                width: "100%",
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={successButton}
        >
          Save Settings
        </button>
      </form>
    </main>
  );
}


function ReportRow({
  label,
  value,
}) {
  return (
    <div style={reportRowStyle}>
      <span style={{ color: "#667085" }}>
        {label}
      </span>

      <strong>{value}</strong>
    </div>
  );
}


function MetricCard({
  label,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderTop: `4px solid ${color}`,
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <span style={{ color: "#667085" }}>
        {label}
      </span>

      <h2
        style={{
          fontSize: "34px",
          margin: "10px 0 0",
        }}
      >
        {value}
      </h2>
    </div>
  );
}


function SeverityBadge({
  value,
}) {
  const colors = {
    Critical: {
      background: "#fee2e2",
      color: "#b91c1c",
    },

    High: {
      background: "#ffedd5",
      color: "#c2410c",
    },

    Medium: {
      background: "#fef3c7",
      color: "#a16207",
    },

    Low: {
      background: "#dcfce7",
      color: "#15803d",
    },
  };

  return (
    <span
      style={{
        ...(colors[value] || {}),
        padding: "5px 9px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {value}
    </span>
  );
}


const pageHeading = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};


const metricGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: "18px",
  marginBottom: "22px",
};


const reportGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, 1fr)",
  gap: "20px",
  marginBottom: "22px",
};


const panelStyle = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "22px",
  overflowX: "auto",
};


const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, 1fr)",
  gap: "14px",
};


const inputStyle = {
  padding: "10px 12px",
  border:
    "1px solid #d8deea",
  borderRadius: "8px",
  background: "white",
};


const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#475467",
};


const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};


const tableHeader = {
  textAlign: "left",
  padding: "12px",
  color: "#667085",
  fontSize: "12px",
};


const tableCell = {
  padding: "14px 12px",
  borderBottom:
    "1px solid #edf0f5",
  fontSize: "14px",
};


const primaryButton = {
  border: "none",
  background: "#635bff",
  color: "white",
  padding: "11px 16px",
  borderRadius: "8px",
  fontWeight: "600",
};


const successButton = {
  border: "none",
  background: "#16a34a",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  fontWeight: "600",
  marginTop: "16px",
};


const editButton = {
  border: "none",
  background: "#dbeafe",
  color: "#1d4ed8",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "6px",
};


const deleteButton = {
  border: "none",
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "6px 10px",
  borderRadius: "6px",
};


const errorStyle = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "20px",
};


const successMessageStyle = {
  background: "#dcfce7",
  color: "#15803d",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "20px",
};


const reportRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom:
    "1px solid #edf0f5",
};


function App() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#f6f7fb",
        }}
      >
        <Header />

        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/findings"
            element={<Findings />}
          />

          <Route
            path="/applications"
            element={<Applications />}
          />

          <Route
            path="/exceptions"
            element={<Exceptions />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Routes>
      </div>
    </div>
  );
}


export default App;
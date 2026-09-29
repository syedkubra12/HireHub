import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Filter,
  LayoutDashboard,
  Mail,
  Plus,
  Search,
  Settings2,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const stages = [
  "New",
  "Review",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];
const roles = [
  {
    title: "Senior Product Designer",
    team: "Design",
    location: "Remote · US",
    count: 18,
    color: "mint",
    initials: "PD",
  },
  {
    title: "Frontend Engineer",
    team: "Engineering",
    location: "Brooklyn, NY",
    count: 24,
    color: "blue",
    initials: "FE",
  },
  {
    title: "Product Marketing Manager",
    team: "Marketing",
    location: "Remote · US",
    count: 12,
    color: "peach",
    initials: "PM",
  },
  {
    title: "Backend Engineer",
    team: "Engineering",
    location: "Brooklyn, NY",
    count: 9,
    color: "lavender",
    initials: "BE",
  },
];
const demoApplicants = [
  {
    id: "a1",
    candidateName: "Amara Okafor",
    email: "amara.okafor@email.com",
    role: roles[0].title,
    stage: "Interview",
    score: 94,
    appliedAt: "2026-09-28",
  },
  {
    id: "a2",
    candidateName: "Luca Moretti",
    email: "luca.moretti@email.com",
    role: roles[1].title,
    stage: "Review",
    score: 88,
    appliedAt: "2026-09-28",
  },
  {
    id: "a3",
    candidateName: "Priya Nair",
    email: "priya.nair@email.com",
    role: roles[2].title,
    stage: "Shortlisted",
    score: 91,
    appliedAt: "2026-09-27",
  },
  {
    id: "a4",
    candidateName: "Noah Williams",
    email: "noah.williams@email.com",
    role: roles[0].title,
    stage: "New",
    score: 76,
    appliedAt: "2026-09-27",
  },
  {
    id: "a5",
    candidateName: "Sofia Andersson",
    email: "sofia.andersson@email.com",
    role: roles[3].title,
    stage: "Interview",
    score: 89,
    appliedAt: "2026-09-26",
  },
  {
    id: "a6",
    candidateName: "Ethan Chen",
    email: "ethan.chen@email.com",
    role: roles[1].title,
    stage: "Review",
    score: 82,
    appliedAt: "2026-09-25",
  },
  {
    id: "a7",
    candidateName: "Maya Patel",
    email: "maya.patel@email.com",
    role: roles[2].title,
    stage: "New",
    score: 72,
    appliedAt: "2026-09-24",
  },
];
const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "candidates", label: "Candidates", icon: UsersRound, count: "48" },
  { id: "jobs", label: "Open roles", icon: BriefcaseBusiness, count: "4" },
  { id: "reports", label: "Reports", icon: Activity },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function shortDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function App() {
  const [applicants, setApplicants] = useState(demoApplicants);
  const [view, setView] = useState("overview");
  const [stageFilter, setStageFilter] = useState("All applicants");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [apiConnected, setApiConnected] = useState(false);
  const [form, setForm] = useState({
    candidateName: "",
    email: "",
    role: roles[0].title,
  });

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/applications`)
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then((data) => {
        if (active && Array.isArray(data) && data.length) {
          setApplicants(data);
          setApiConnected(true);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleApplicants = useMemo(
    () =>
      applicants.filter((candidate) => {
        const matchesStage =
          stageFilter === "All applicants" || candidate.stage === stageFilter;
        const query = search.trim().toLowerCase();
        return (
          matchesStage &&
          (!query ||
            `${candidate.candidateName} ${candidate.email} ${candidate.role}`
              .toLowerCase()
              .includes(query))
        );
      }),
    [applicants, search, stageFilter],
  );
  const reviewCount = applicants.filter(({ stage }) =>
    ["New", "Review", "Shortlisted"].includes(stage),
  ).length;
  const interviewCount = applicants.filter(
    ({ stage }) => stage === "Interview",
  ).length;
  const pageTitle = {
    overview: "Good morning, Alex",
    candidates: "Your candidates",
    jobs: "Open roles",
    reports: "Hiring insights",
  }[view];

  async function addApplicant(event) {
    event.preventDefault();
    const localCandidate = {
      id: `local-${Date.now()}`,
      ...form,
      stage: "New",
      score: 80,
      appliedAt: new Date().toISOString().slice(0, 10),
    };
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        const savedCandidate = await response.json();
        setApplicants((current) => [savedCandidate, ...current]);
        setApiConnected(true);
      } else setApplicants((current) => [localCandidate, ...current]);
    } catch {
      setApplicants((current) => [localCandidate, ...current]);
    }
    setModalOpen(false);
    setForm({ candidateName: "", email: "", role: roles[0].title });
    setToast("Candidate added to your pipeline");
  }

  async function changeStage(candidate, stage) {
    setApplicants((current) =>
      current.map((item) =>
        item.id === candidate.id ? { ...item, stage } : item,
      ),
    );
    try {
      const response = await fetch(
        `${API_URL}/applications/${candidate.id}/stage`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage }),
        },
      );
      if (response.ok) setApiConnected(true);
    } catch {
      /* Keep the change available in demo mode. */
    }
    setToast(`${candidate.candidateName.split(" ")[0]} moved to ${stage}`);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#overview"
          onClick={() => setView("overview")}
          aria-label="HireHub home"
        >
          <span className="brand-mark">
            h<span>.</span>
          </span>
          <span className="brand-name">hirehub</span>
        </a>
        <button
          className="workspace-switcher"
          onClick={() => setToast("Northstar Studio workspace")}
        >
          <span className="workspace-avatar">N</span>
          <span className="workspace-copy">
            <strong>Northstar Studio</strong>
            <small>Free workspace</small>
          </span>
          <ChevronDown size={15} />
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              className={`nav-link ${view === id ? "active" : ""}`}
              onClick={() => setView(id)}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {count && <span className="nav-count">{count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <span className="tip-icon">
            <Sparkles size={16} />
          </span>
          <strong>Make your next great hire.</strong>
          <p>Keep the team moving with a clear view of every candidate.</p>
          <button onClick={() => setView("reports")}>
            View hiring report <ArrowRight size={14} />
          </button>
        </div>
        <button
          className="nav-link settings-link"
          onClick={() => setToast("Workspace settings are coming soon")}
        >
          <Settings2 size={17} />
          <span>Settings</span>
        </button>
        <div className="profile-row">
          <div className="profile-avatar">AC</div>
          <span className="workspace-copy">
            <strong>Alex Chen</strong>
            <small>Recruiter</small>
          </span>
          <button
            className="icon-button"
            aria-label="Profile options"
            onClick={() => setToast("Signed in as Alex Chen")}
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span className="crumb-divider">/</span>
            <strong>{navItems.find(({ id }) => id === view)?.label}</strong>
          </div>
          <div className="topbar-actions">
            <div className={`connection-pill ${apiConnected ? "online" : ""}`}>
              <span />
              {apiConnected ? "API connected" : "Demo data"}
            </div>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setToast("You’re all caught up")}
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="topbar-divider" />
            <button
              className="help-button"
              onClick={() => setToast("Help center is coming soon")}
            >
              <CircleHelp size={17} />
              <span>Help</span>
            </button>
          </div>
        </header>
        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" /> TUESDAY, SEPTEMBER 29, 2026
              </div>
              <h1>
                {pageTitle}
                <span className="title-period">.</span>
              </h1>
              <p className="welcome-subtitle">
                Here’s what’s happening with your hiring pipeline today.
              </p>
            </div>
            <div className="welcome-actions">
              <button
                className="button button-quiet"
                onClick={() => setView("jobs")}
              >
                <BriefcaseBusiness size={16} /> View roles
              </button>
              <button
                className="button button-primary"
                onClick={() => setModalOpen(true)}
              >
                <Plus size={17} /> Add candidate
              </button>
            </div>
          </section>
          <section className="metrics-grid" aria-label="Hiring metrics">
            <MetricCard
              label="Active candidates"
              value={applicants.length}
              change="+12%"
              note="vs. last month"
              icon={UsersRound}
              color="green"
            />
            <MetricCard
              label="In review"
              value={reviewCount}
              change="8 need attention"
              note="across 4 open roles"
              icon={Search}
              color="blue"
            />
            <MetricCard
              label="Interviews this week"
              value={interviewCount + 6}
              change="3 today"
              note="next up at 2:30 PM"
              icon={CalendarDays}
              color="orange"
            />
            <MetricCard
              label="Offers pending"
              value={2}
              change="2 awaiting reply"
              note="avg. time to hire 18d"
              icon={Clock3}
              color="purple"
            />
          </section>
          <section className="insight-grid">
            <div className="panel pipeline-panel">
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">PIPELINE HEALTH</div>
                  <h2>Hiring at a glance</h2>
                </div>
                <button
                  className="period-select"
                  onClick={() => setToast("Showing the last 30 days")}
                >
                  Last 30 days <ChevronDown size={14} />
                </button>
              </div>
              <div className="pipeline-content">
                <div
                  className="pipeline-chart"
                  aria-label="Hiring pipeline funnel"
                >
                  <div className="chart-y-labels">
                    <span>50</span>
                    <span>40</span>
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                    <span>0</span>
                  </div>
                  <div className="chart-area">
                    <div className="chart-gridlines">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="bar-group">
                      <div className="bar bar-one" />
                      <div className="bar bar-two" />
                      <div className="bar bar-three" />
                      <div className="bar bar-four" />
                      <div className="bar bar-five" />
                      <div className="bar bar-six" />
                    </div>
                    <div className="chart-x-labels">
                      <span>New</span>
                      <span>Review</span>
                      <span>Shortlist</span>
                      <span>Interview</span>
                      <span>Offer</span>
                      <span>Hired</span>
                    </div>
                  </div>
                </div>
                <div className="chart-summary">
                  <div className="summary-number">
                    48<span> candidates</span>
                  </div>
                  <div className="summary-delta">
                    <ArrowDown size={13} /> 18% from last month
                  </div>
                  <div className="chart-legend">
                    <span>
                      <i className="legend-current" /> This month
                    </span>
                    <span>
                      <i className="legend-previous" /> Last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel roles-panel">
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">YOUR TEAM</div>
                  <h2>
                    Open roles <span className="heading-count">04</span>
                  </h2>
                </div>
                <button className="text-action" onClick={() => setView("jobs")}>
                  See all <ArrowRight size={14} />
                </button>
              </div>
              <div className="role-list">
                {roles.slice(0, 3).map((role) => (
                  <RoleRow
                    key={role.title}
                    role={role}
                    onClick={() => setView("jobs")}
                  />
                ))}
              </div>
              <button
                className="add-role-button"
                onClick={() =>
                  setToast("Create a role from the Open roles page")
                }
              >
                <Plus size={15} /> Add a new role
              </button>
            </div>
          </section>

          {view === "jobs" ? (
            <section className="panel candidates-panel jobs-view">
              <div className="panel-heading candidates-heading">
                <div>
                  <div className="section-kicker">TEAM GROWTH</div>
                  <h2>
                    Open roles <span className="heading-count">04</span>
                  </h2>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setToast("Role creation is coming soon")}
                >
                  <Plus size={16} /> Create role
                </button>
              </div>
              <div className="jobs-grid">
                {roles.map((role) => (
                  <RoleCard key={role.title} role={role} />
                ))}
              </div>
            </section>
          ) : view === "reports" ? (
            <section className="panel reports-panel">
              <div className="panel-heading">
                <div>
                  <div className="section-kicker">TEAM PERFORMANCE</div>
                  <h2>Hiring insights</h2>
                </div>
                <span className="report-range">September 2026</span>
              </div>
              <div className="report-stats">
                <div>
                  <span>Time to hire</span>
                  <strong>
                    18 <small>days</small>
                  </strong>
                  <em>↓ 4 days from August</em>
                </div>
                <div>
                  <span>Offer acceptance</span>
                  <strong>
                    86<small>%</small>
                  </strong>
                  <em>↑ 8% from August</em>
                </div>
                <div>
                  <span>Applications per role</span>
                  <strong>
                    16 <small>avg.</small>
                  </strong>
                  <em>Across 4 active roles</em>
                </div>
              </div>
              <div className="report-note">
                <Sparkles size={17} />
                <p>
                  <strong>Your pipeline is moving faster.</strong>{" "}
                  Interview-to-offer conversion improved this month. Keep
                  feedback loops under 48 hours to maintain momentum.
                </p>
              </div>
            </section>
          ) : (
            <section className="panel candidates-panel">
              <div className="panel-heading candidates-heading">
                <div>
                  <div className="section-kicker">TALENT PIPELINE</div>
                  <h2>
                    Recent candidates{" "}
                    <span className="heading-count">
                      {visibleApplicants.length.toString().padStart(2, "0")}
                    </span>
                  </h2>
                </div>
                <button
                  className="text-action"
                  onClick={() => setView("candidates")}
                >
                  View all candidates <ArrowRight size={14} />
                </button>
              </div>
              <div className="candidate-toolbar">
                <div
                  className="stage-tabs"
                  role="tablist"
                  aria-label="Filter candidates by stage"
                >
                  {["All applicants", "New", "Review", "Interview"].map(
                    (stage) => (
                      <button
                        key={stage}
                        role="tab"
                        aria-selected={stageFilter === stage}
                        className={stageFilter === stage ? "selected" : ""}
                        onClick={() => setStageFilter(stage)}
                      >
                        {stage}
                        {stage === "All applicants" && (
                          <span>{applicants.length}</span>
                        )}
                      </button>
                    ),
                  )}
                </div>
                <div className="table-tools">
                  <label className="table-search">
                    <Search size={15} />
                    <input
                      aria-label="Search candidates"
                      placeholder="Search candidates..."
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                    <kbd>⌘ K</kbd>
                  </label>
                  <button
                    className="filter-button"
                    onClick={() => setToast("Use the tabs to filter by stage")}
                  >
                    <Filter size={15} />
                    <span>Filter</span>
                    <i />
                  </button>
                </div>
              </div>
              <div className="table-scroll">
                <table className="candidate-table">
                  <thead>
                    <tr>
                      <th>
                        <span className="check-box" />
                      </th>
                      <th>
                        Candidate <ArrowDown size={12} />
                      </th>
                      <th>Applied for</th>
                      <th>Stage</th>
                      <th>Match</th>
                      <th>Applied</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleApplicants
                      .slice(0, view === "candidates" ? undefined : 5)
                      .map((candidate, index) => (
                        <CandidateRow
                          key={candidate.id}
                          candidate={candidate}
                          index={index}
                          onStageChange={changeStage}
                        />
                      ))}
                    {visibleApplicants.length === 0 && (
                      <tr>
                        <td className="empty-state" colSpan="7">
                          No candidates match your search yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <span>
                  Showing{" "}
                  <strong>
                    {visibleApplicants.length
                      ? `1–${Math.min(visibleApplicants.length, view === "candidates" ? visibleApplicants.length : 5)}`
                      : "0"}
                  </strong>{" "}
                  of <strong>{visibleApplicants.length}</strong> candidates
                </span>
                <button onClick={() => setView("candidates")}>
                  View pipeline <ArrowRight size={14} />
                </button>
              </div>
            </section>
          )}
          <footer className="page-footer">
            <span>© 2026 HireHub</span>
            <span className="footer-dot">·</span>
            <button
              onClick={() => setToast("Privacy information is coming soon")}
            >
              Privacy
            </button>
            <span className="footer-dot">·</span>
            <button onClick={() => setToast("Support is coming soon")}>
              Support
            </button>
            <span className="footer-spacer" />
            <span className="system-status">
              <i /> All systems operational
            </span>
          </footer>
        </div>
      </main>

      {modalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className="candidate-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <div>
                <div className="section-kicker">TALENT PIPELINE</div>
                <h2 id="modal-title">Add a candidate</h2>
                <p>Start a new candidate profile for an open role.</p>
              </div>
              <button
                className="icon-button"
                aria-label="Close dialog"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={addApplicant}>
              <label>
                Full name
                <input
                  required
                  autoFocus
                  value={form.candidateName}
                  onChange={(event) =>
                    setForm({ ...form, candidateName: event.target.value })
                  }
                  placeholder="e.g. Jordan Lee"
                />
              </label>
              <label>
                Email address
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="jordan@email.com"
                />
              </label>
              <label>
                Applying for
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                >
                  {roles.map((role) => (
                    <option key={role.title}>{role.title}</option>
                  ))}
                </select>
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  <Plus size={16} /> Add candidate
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={15} />
          </span>
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, change, note, icon: Icon, color }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${color}`}>
        <Icon size={17} strokeWidth={1.9} />
      </div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">
        <span className={color === "green" ? "positive-note" : ""}>
          {change}
        </span>
        <span>{note}</span>
      </div>
      <div className={`metric-accent ${color}`} />
    </article>
  );
}

function RoleRow({ role, onClick }) {
  return (
    <button className="role-row" onClick={onClick}>
      <span className={`role-icon ${role.color}`}>{role.initials}</span>
      <span className="role-info">
        <strong>{role.title}</strong>
        <small>{role.team}</small>
      </span>
      <span className="role-applicants">
        <strong>{role.count}</strong>
        <small>applicants</small>
      </span>
      <ArrowRight size={15} className="role-arrow" />
    </button>
  );
}

function RoleCard({ role }) {
  return (
    <article className="role-card">
      <div className={`role-icon ${role.color}`}>{role.initials}</div>
      <span className="role-status">
        <i /> Recruiting
      </span>
      <h3>{role.title}</h3>
      <p>
        {role.team} <span>·</span> {role.location}
      </p>
      <div className="role-card-footer">
        <span>
          <UsersRound size={15} /> {role.count} applicants
        </span>
        <button aria-label={`View ${role.title} applicants`}>
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function CandidateRow({ candidate, index, onStageChange }) {
  const selectId = `stage-${candidate.id}`;
  return (
    <tr style={{ "--row-index": index }}>
      <td>
        <label className="check-box-wrap">
          <input
            type="checkbox"
            aria-label={`Select ${candidate.candidateName}`}
          />
          <span className="check-box" />
        </label>
      </td>
      <td>
        <div className="candidate-person">
          <div className={`candidate-avatar avatar-${index % 6}`}>
            {initials(candidate.candidateName)}
          </div>
          <span>
            <strong>{candidate.candidateName}</strong>
            <small>
              <Mail size={11} /> {candidate.email}
            </small>
          </span>
        </div>
      </td>
      <td>
        <span className="applied-role">{candidate.role}</span>
      </td>
      <td>
        <label
          className={`stage-badge stage-${candidate.stage.toLowerCase()}`}
          htmlFor={selectId}
        >
          <span />
          {candidate.stage}
          <ChevronDown size={12} />
          <select
            id={selectId}
            aria-label={`Change ${candidate.candidateName}'s stage`}
            value={candidate.stage}
            onChange={(event) => onStageChange(candidate, event.target.value)}
          >
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
        </label>
      </td>
      <td>
        <span
          className={`match-score ${candidate.score >= 85 ? "strong-match" : ""}`}
        >
          <i>{candidate.score >= 85 && <Sparkles size={10} />}</i>
          {candidate.score}%
        </span>
      </td>
      <td>
        <span className="applied-date">{shortDate(candidate.appliedAt)}</span>
      </td>
      <td>
        <button
          className="row-more"
          aria-label={`More options for ${candidate.candidateName}`}
        >
          <span />
          <span />
          <span />
        </button>
      </td>
    </tr>
  );
}

export default App;

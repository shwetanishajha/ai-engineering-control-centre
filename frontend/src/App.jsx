
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");

  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:3000/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      setProjects(await response.json());
    } catch {
      setError("Could not load projects. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function changeStatus(project) {
    const newStatus =
      project.status === "Completed" ? "In Progress" : "Completed";

    setUpdating(project.name);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/projects/${encodeURIComponent(project.name)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Update failed");

      setProjects((current) =>
        current.map((item) => item.name === result.name ? result : item)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating("");
    }
  }

  async function addProject(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, owner })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create project");

      setProjects((current) => [...current, result]);
      setName("");
      setOwner("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="dashboard">
      <header className="header">
        <div>
          <p className="eyebrow">ENGINEERING OPERATIONS</p>
          <h1>AI Engineering Control Centre</h1>
          <p className="subtitle">Monitor your engineering projects in one place.</p>
        </div>
        <span className="project-count">
          {projects.filter((p) => p.status === "Completed").length}
          {" "}Completed / {projects.length} Projects
        </span>
      </header>

      <form className="project-card" onSubmit={addProject}>
        <h2>Add a project</h2>
        <label htmlFor="project-name">Project name</label>
        <input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. AI Risk Monitor"
          required
        />

        <label htmlFor="project-owner">Owner</label>
        <input
          id="project-owner"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="e.g. AI Platform"
          required
        />

        <button type="submit">Create project</button>
      </form>

      {error && <p role="alert">{error}</p>}
      {loading && <p>Loading projects...</p>}

      {!loading && (
        <section className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <p className="card-label">PROJECT</p>
              <h2>{project.name}</h2>
              <p className="owner">Owner: {project.owner}</p>

              <div className="card-footer">
                <span className={`status ${project.status.toLowerCase().replace(" ", "-")}`}>
                  {project.status}
                </span>
                <button
                  onClick={() => changeStatus(project)}
                  disabled={updating === project.name}
                >
                  {updating === project.name
                    ? "Saving..."
                    : project.status === "Completed" ? "Reopen" : "Complete"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;

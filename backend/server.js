
const http = require("node:http");

const fs = require("node:fs");
const path = require("node:path");

const projectsFile = path.join(__dirname, "projects.json");

let projects = JSON.parse(
  fs.readFileSync(projectsFile, "utf8")
);

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode);
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  console.log("Request:", req.method, req.url);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/health") {
    sendJson(res, 200, { status: "healthy" });
    return;
  }

  if (req.method === "GET" && req.url === "/api/projects") {
    sendJson(res, 200, projects);
    return;
  }

  if (req.method === "POST" && req.url === "/api/projects") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newProject = JSON.parse(body);
        const { name, owner } = newProject;

        if (
          typeof name !== "string" ||
          !name.trim() ||
          typeof owner !== "string" ||
          !owner.trim()
        ) {
          sendJson(res, 400, {
            error: "Project name and owner are required."
          });
          return;
        }

        if (
          projects.some(
            (project) =>
              project.name.toLowerCase() === name.trim().toLowerCase()
          )
        ) {
          sendJson(res, 409, { error: "Project already exists." });
          return;
        }

        const project = {
          name: name.trim(),
          owner: owner.trim(),
          status: "Planned"
        };

        projects.push(project);
        fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
        sendJson(res, 201, project);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON request body." });
      }
    });

    return;
  }

  if (req.method === "PUT" && req.url.startsWith("/api/projects/")) {
    let projectName;

    try {
      projectName = decodeURIComponent(
        req.url.slice("/api/projects/".length)
      );
    } catch {
      sendJson(res, 400, { error: "Invalid project URL." });
      return;
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const { status } = JSON.parse(body);
        const project = projects.find((item) => item.name === projectName);

        if (!project) {
          sendJson(res, 404, { error: "Project not found." });
          return;
        }

        const allowedStatuses = [
          "Planned",
          "In Progress",
          "Testing",
          "Completed"
        ];

        if (!allowedStatuses.includes(status)) {
          sendJson(res, 400, { error: "Invalid status." });
          return;
        }

        project.status = status;
        fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
        sendJson(res, 200, project);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON request body." });
      }
    });

    return;
  }

  sendJson(res, 404, { error: "Route not found." });
});

server.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});

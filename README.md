# AI Engineering Control Centre

A full-stack web application for managing engineering projects, built with React, JavaScript and Node.js.

## Features

- View engineering projects and their current status.
- Create new projects with a name and owner.
- Mark projects as completed or reopen them.
- Persist project data using JSON file storage.
- Communicate between frontend and backend through REST APIs.

## Technology Stack

- **Frontend:** React, JavaScript, Vite and CSS
- **Backend:** Node.js using the built-in HTTP module
- **API:** REST endpoints with JSON request and response bodies
- **Storage:** Local JSON file (`backend/projects.json`)
- **Version control:** Git and GitHub

## Architecture

The React frontend sends HTTP requests to the Node.js backend. The backend validates requests, applies project updates and reads or writes project data to a local JSON file.

```text
React Frontend
      |
      | HTTP / JSON
      v
Node.js REST API
      |
      v
projects.json
```

## Getting Started

### Prerequisites

- Node.js
- npm

### 1. Start the backend

Open a terminal in the project root and run:

```bash
cd backend
node server.js
```

The backend runs at `http://localhost:3000`.

### 2. Start the frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/projects` | Retrieve all projects |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/:name` | Update a project's status |

## Current Limitations

- Project data is stored in a local JSON file rather than a database.
- This implementation is intended as a learning project, not a production-ready service.
- Authentication, automated deployment and production-grade concurrency controls have not yet been implemented.

## Learning Objectives

This project demonstrates practical experience with frontend development, backend API implementation, JavaScript, file-system operations, data validation and version control.

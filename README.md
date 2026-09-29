## HireHub

HireHub is a recruiting workspace for tracking applicants through a hiring pipeline. The React dashboard supports candidate search, stage filters, candidate creation, role browsing, and pipeline reporting. A Spring Boot API persists applications in MySQL and publishes lifecycle events to a separate Express notification service.

## Stack

- Frontend: HTML, CSS, JavaScript, React, Vite
- Hiring API: Java 21, Spring Boot, Spring Data JPA, Bean Validation
- Database: MySQL 8
- Notification service: Node.js, Express
- Local orchestration: Docker Compose

## Run With Docker

Install Docker Desktop, then from the project root run:

```sh
docker compose up --build
```

Open `http://localhost:5173`. The dashboard starts with seeded candidate records. The API is at `http://localhost:8080`, and the notification service is at `http://localhost:3001`.

The Compose file uses development-only database passwords. Do not use those defaults outside a local machine. To override them, create a `.env` file based on `.env.example` before starting the stack.

## Run Services Separately

Prerequisites: Node.js 20+, Java 21+, Maven 3.9+, and MySQL 8. Create the database and local user (or set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` to match your existing setup):

```sql
CREATE DATABASE hirehub;
CREATE USER 'hirehub'@'localhost' IDENTIFIED BY 'hirehub';
GRANT ALL PRIVILEGES ON hirehub.* TO 'hirehub'@'localhost';
```

Then start each service in a separate terminal:

```sh
npm install
npm run dev
```

```sh
npm install --prefix notifications
npm start --prefix notifications
```

```sh
cd backend
mvn spring-boot:run
```

By default, Spring connects to `jdbc:mysql://localhost:3306/hirehub` with username and password `hirehub`. Override `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, or `NOTIFICATIONS_URL` as needed. The Vite client reads `VITE_API_URL` and defaults to `http://localhost:8080/api`. If the API is unavailable, the frontend uses an in-memory demo dataset so the interface remains explorable.

## API

| Method  | Route                          | Description                                              |
| ------- | ------------------------------ | -------------------------------------------------------- |
| `GET`   | `/api/applications`            | List applications, newest first                          |
| `POST`  | `/api/applications`            | Create an application (`candidateName`, `email`, `role`) |
| `PATCH` | `/api/applications/{id}/stage` | Move an application to a pipeline stage                  |
| `GET`   | `/api/notifications`           | List recent notification events                          |
| `POST`  | `/api/notifications`           | Accept a lifecycle event from the hiring API             |
| `GET`   | `/health`                      | Notification service health check                        |

Valid stages are `New`, `Review`, `Shortlisted`, `Interview`, `Offer`, `Hired`, and `Rejected`. The API persists candidate applications; the role catalog and historical chart values are demo fixtures. The notification service keeps the latest 100 events in memory, while candidate data lives in MySQL.

## Checks

```sh
npm run lint
npm run build
npm test --prefix notifications
```

With Maven installed, run the API test/build lifecycle with `mvn -f backend/pom.xml test`.

## Resume Summary

**HireHub | Full-Stack Applicant Tracking System**

- Built a responsive recruiting dashboard with React, JavaScript, HTML, and CSS for searching candidates, filtering by pipeline stage, reviewing roles, and updating application status.
- Developed a Java Spring Boot REST API with validation and Spring Data JPA, persisting candidate applications in MySQL.
- Integrated an Express notification microservice that receives candidate-created and stage-change events from the hiring API.
- Added Docker Compose orchestration, seeded demo data, and service tests for the notification API.

Describe only the features you can explain and demonstrate in an interview. Add measurable outcomes only after you have measured them yourself.

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

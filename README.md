# LockN v2

LockN is a fitness tracker with a React dashboard and an Express API. Users can create an account, build and complete workouts, manage tasks and weekly, monthly, and yearly goals, and view leaderboards and groups. The API also contains an AI route for workout assistance.

## Stack

- React, React Router, and Vite in `frontend/`
- Node.js and Express in `backend/`
- PostgreSQL for accounts, workouts, tasks, goals, and rankings

## Run locally

You need Node.js, npm, and access to the PostgreSQL database configured in `backend/db.js`. The checked-in SQL under `backend/sql/` does **not** define the entire application schema, so a fresh database cannot be initialized from this repository alone.

1. In `backend/`, run `npm ci`.
2. Create `backend/.env` with your own values:

   ```dotenv
   PASSWORD=your_database_password
   SESSION_SECRET=replace_with_a_random_secret
   JWT_SECRET=replace_with_a_random_secret
   OPENAI_API_KEY=your_key_if_using_ai
   ```

3. Run `npm run dev` in `backend/`. The API listens on `http://localhost:3000`.
4. In `frontend/`, run `npm ci`. Create `frontend/.env` containing:

   ```dotenv
   VITE_BACKEND_URL=http://localhost:3000
   ```

5. Run `npm run dev` in `frontend/` and open `http://localhost:5173`.

`backend/db.js` currently fixes the database host and user to a Supabase pooler; `PASSWORD` supplies only its password. To use another PostgreSQL instance, update that connection configuration. The AI route requires an OpenAI key.

Docker Compose can start both Node services with `docker compose up --build`, after creating the same `.env` files. The Compose file does not start PostgreSQL.

## Project layout

| Path | Purpose |
| --- | --- |
| `frontend/src/pages/` | Dashboard, authentication, workouts, tasks, goals, and rankings |
| `backend/app.js` | API server, sessions, and route mounting |
| `backend/routes/` | Feature endpoints |
| `backend/db/` | Queries for workouts, tasks, and goals |
| `backend/services/` | AI integration |

Run `npm run lint` and `npm run build` from `frontend/` to check frontend changes. The backend's `npm test` script is a placeholder.

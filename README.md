# CRUD Operation (MERN)

A full-stack CRUD application built with:

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React (Create React App), Axios

This project supports creating, reading, updating, and deleting users with:

- Search
- Role and status filters
- Pagination
- Basic dashboard stats

## Project Structure

```text
CRUD opration/
  backend/
  frontend/
```

## Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB running locally (default: `mongodb://localhost:27017`)

## 1) Backend Setup

```bash
cd backend
npm install
```

Create or verify `.env` in `backend`:

```env
MONGO_URI=mongodb://localhost:27017/crudapp
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Run backend

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Seed sample data

```bash
npm run seed
```

## 2) Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`.

By default, API calls use:

- CRA proxy (`/api` -> `http://localhost:5000`), or
- `REACT_APP_API_URL` if provided.

Optional frontend env (`frontend/.env`):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /health` - server/db status
- `GET /users` - list users with query params
- `GET /users/:id` - get one user
- `POST /users` - create user
- `PUT /users/:id` - update user
- `DELETE /users/:id` - delete one user
- `DELETE /users` - bulk delete (body: `{ "ids": [] }`)

### Example query params for `GET /users`

- `search`
- `role`
- `status` (`active` or `inactive`)
- `page`
- `limit`
- `sortBy`
- `order` (`asc` or `desc`)

## Common Issues

1. `Unknown command: "seed.js"`
   Use:

```bash
npm run seed
```

2. Frontend cannot reach backend

- Ensure backend is running on port `5000`
- Check `proxy` in `frontend/package.json`
- Or set `REACT_APP_API_URL` in `frontend/.env`

3. MongoDB connection error

- Make sure MongoDB service is running
- Verify `MONGO_URI` in `backend/.env`

## Quick Start (2 terminals)

Terminal 1:

```bash
cd backend
npm install
npm run seed
npm start
```

Terminal 2:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`.

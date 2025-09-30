# ConvoHub

A MERN-based student communication dashboard with real-time chat.

## Structure
- `client/` React + Vite + Tailwind + shadcn/ui
- `server/` Node.js + Express + Socket.io + MongoDB (Mongoose)

## Quickstart

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)

### Backend
```bash
cd server
npm install
npm run dev
```
Create `.env` based on `.env.example`.

### Frontend
```bash
cd client
npm install
npm run dev
```
Create `.env` based on `.env.example`.

## MVP Features
- Notice Board
- Cohort Chat (Socket.io)
- Direct Messaging
- Verified Profiles
- Complaint Box

## License
MIT

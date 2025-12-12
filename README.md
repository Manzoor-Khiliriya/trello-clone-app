# Trello Clone

A simplified Trello-like board built with **React**, **Vite**, **Tailwind CSS**, **@dnd-kit** for drag-and-drop, and **Node.js + Express** backend.

---

## Features

- Display multiple lists (Todo, In Progress, Done)
- Drag-and-drop cards within the same list or between lists
- Add new cards dynamically
- Add new lists dynamically
- Optimistic UI updates with backend persistence
- Minimal modern UI inspired by Trello

---

## Tech Stack

- **Frontend:** React, Vite, @dnd-kit, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Data Store:** In-memory (for simplicity)  
- **API:** REST endpoints (`/board`, `/board/card/move`, `/board/card`, `/board/list`)

---
## Project Structure
```
trello-clone-app/
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/      # Route handlers (boardController.js)
│   │   ├── data/             # In-memory data models (BoardData.js)
│   │   ├── routes/           # Express routes (boardRoutes.js)
│   │   └── app.js            # Express app setup
│   ├── server.js             # Starts backend server
│   ├── package.json
│   └── README.md
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── api/              # API calls (boardApi.js)
│   │   ├── components/       # UI components (Board.jsx, List.jsx, Card.jsx)
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Setup Instructions

1. **Clone repository:**
```
git clone https://github.com/Manzoor-Khiliriya/trello-clone-app.git
cd trello-clone-app
```
2. **Backend Setup:**
```
cd backend
npm install
npm run dev      # Runs server with nodemon on http://localhost:5000
```
3. **Frontend Setup:**
```
cd frontend
npm install
npm run dev      # Runs React app (e.g., http://localhost:5173)
```

Open in browser:
Go to http://localhost:5173 / 3000 to see the board.

## API Endpoints

- GET /board – Fetch board with lists and cards

- POST /board/card/move – Move a card

{
  "sourceListId": "todo",
  "destinationListId": "done",
  "cardId": "1",
  "sourceIndex": 0,
  "destinationIndex": 1
}


- POST /board/card – Add a new card

- POST /board/list – Add a new list

## Assumptions / Trade-offs

### In-memory backend:
- Simple and fast for prototype.
- Data resets on server restart.
- No authentication; single shared board.
  
### Optimistic UI updates:
- UI updates immediately for smooth UX.
- If backend fails, board is refreshed.

### Styling:
- Minimal, modern, inspired by Trello using Tailwind css.
- Focused on usability rather than pixel-perfect replication.

### Scalability:
- Suitable for small projects or demo.
- For production, a database (PostgreSQL/MongoDB) and authentication would be required.

### Future Improvements:
- Persistent database storage
- User authentication & multiple boards
- Drag-and-drop multiple cards selection
- Undo/Redo actions
- Real-time updates with WebSockets

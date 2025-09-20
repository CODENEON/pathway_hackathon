# LearnPro UI with Integrated Document API

This UI project includes both the React frontend and an integrated Node.js document management API server.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS (port 3000)
- **Document API**: Express.js server (port 3001)
- **Proxy**: Vite dev server proxies `/api/*` requests to the document server
- **Database**: SQLite for document metadata
- **File Storage**: Local uploads + automatic sync to `../../data/` for Pathway

## Development

```bash
# Install all dependencies (frontend + backend)
npm install

# Start both servers simultaneously
npm run dev
```

This will start:
1. **Document API Server** (port 3001) - handles file uploads and database
2. **Vite Dev Server** (port 3000) - serves React app with API proxy

## File Structure

```
ui/
├── src/                    # React frontend source
├── server/                 # Express.js API server
│   ├── index.js           # Main server file
│   ├── uploads/           # Local file storage (gitignored)
│   └── documents.db       # SQLite database (gitignored)
├── package.json           # Dependencies for both frontend + backend
└── vite.config.ts         # Includes API proxy configuration
```

## API Endpoints

All API requests from the frontend go through Vite proxy (`/api/*`):

- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:userId` - Get user documents
- `DELETE /api/documents/:documentId` - Delete document
- `GET /api/documents/:documentId/content` - Preview document

## Data Flow

1. **Upload**: Files saved to `server/uploads/` and copied to `../../data/`
2. **Database**: Metadata stored in SQLite with user association
3. **Pathway Integration**: Files in `../../data/` are automatically processed by Pathway RAG
4. **Delete**: Removes files from both locations and database

## Environment Variables

No additional environment variables needed. The server auto-configures paths and database.
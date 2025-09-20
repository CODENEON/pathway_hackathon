import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const sqlite = sqlite3.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'documents.db');
const db = new sqlite.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      document_id TEXT UNIQUE NOT NULL,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_type TEXT NOT NULL,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      pathway_data_path TEXT NOT NULL
    )
  `);
});

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const pathwayDataDir = path.join(__dirname, '..', '..', 'data'); // Go up to project root, then to data

fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(pathwayDataDir);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const documentId = uuidv4();
    const extension = path.extname(file.originalname);
    const storedName = `${documentId}${extension}`;
    req.documentId = documentId;
    req.storedName = storedName;
    cb(null, storedName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/javascript',
      'text/x-python',
      'text/x-c',
      'text/x-java-source'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  }
});

// Routes

// Upload documents
app.post('/api/documents/upload', upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const documentId = req.documentId;
  const storedName = req.storedName;
  const originalName = req.file.originalname;
  const fileSize = req.file.size;
  const fileType = req.file.mimetype;
  
  // Copy file to Pathway data directory
  const pathwayDataPath = path.join(pathwayDataDir, storedName);
  
  fs.copy(req.file.path, pathwayDataPath)
    .then(() => {
      // Save document info to database
      const stmt = db.prepare(`
        INSERT INTO user_documents 
        (user_id, document_id, original_name, stored_name, file_size, file_type, pathway_data_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([userId, documentId, originalName, storedName, fileSize, fileType, pathwayDataPath], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save document info' });
        }
        
        res.json({
          success: true,
          document: {
            id: documentId,
            originalName: originalName,
            storedName: storedName,
            fileSize: fileSize,
            fileType: fileType,
            uploadDate: new Date().toISOString()
          }
        });
      });
      
      stmt.finalize();
    })
    .catch(err => {
      console.error('File copy error:', err);
      res.status(500).json({ error: 'Failed to copy file to data directory' });
    });
});

// Get user documents
app.get('/api/documents/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.all(
    'SELECT * FROM user_documents WHERE user_id = ? ORDER BY upload_date DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch documents' });
      }
      
      const documents = rows.map(row => ({
        id: row.document_id,
        originalName: row.original_name,
        storedName: row.stored_name,
        fileSize: row.file_size,
        fileType: row.file_type,
        uploadDate: row.upload_date
      }));
      
      res.json({ documents });
    }
  );
});

// Delete document
app.delete('/api/documents/:documentId', (req, res) => {
  const { documentId } = req.params;
  
  // First, get document info from database
  db.get(
    'SELECT * FROM user_documents WHERE document_id = ?',
    [documentId],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch document' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      // Delete files
      const uploadPath = path.join(uploadsDir, row.stored_name);
      const pathwayPath = row.pathway_data_path;
      
      Promise.all([
        fs.remove(uploadPath).catch(() => {}), // Ignore if file doesn't exist
        fs.remove(pathwayPath).catch(() => {})
      ])
      .then(() => {
        // Delete from database
        db.run(
          'DELETE FROM user_documents WHERE document_id = ?',
          [documentId],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to delete document record' });
            }
            
            res.json({ success: true, message: 'Document deleted successfully' });
          }
        );
      })
      .catch(err => {
        console.error('File deletion error:', err);
        res.status(500).json({ error: 'Failed to delete document files' });
      });
    }
  );
});

// Get document content (for preview)
app.get('/api/documents/:documentId/content', (req, res) => {
  const { documentId } = req.params;
  
  db.get(
    'SELECT * FROM user_documents WHERE document_id = ?',
    [documentId],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch document' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      const filePath = path.join(uploadsDir, row.stored_name);
      
      res.setHeader('Content-Type', row.file_type);
      res.setHeader('Content-Disposition', `inline; filename="${row.original_name}"`);
      
      fs.createReadStream(filePath)
        .on('error', (err) => {
          console.error('File read error:', err);
          res.status(500).json({ error: 'Failed to read document' });
        })
        .pipe(res);
    }
  );
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`📄 Document API server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🗃️ Pathway data directory: ${pathwayDataDir}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down document server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
# Document Analyzer

A Vue 3 application for document analysis using Azure Document Intelligence and Claude AI. This project demonstrates how to extract text and structured information from documents and perform AI-powered analysis.

## Features

- ✅ Upload documents (PDF, images, Word files)
- ✅ Extract text, tables, and key-value pairs from documents using Azure Document Intelligence
- ✅ Analyze document content with Claude AI
- ✅ Modern Vue 3 application with Composition API
- ✅ State management with Pinia
- ✅ Responsive UI with Bootstrap 5
- ✅ Express.js backend for secure API integration

## Project Setup

### Prerequisites

- Node.js and npm installed
- Azure Document Intelligence account
- Claude API access

### Installation

1. Clone the repository:

```bash
git clone https://github.com/simon-lennon/vue-document-analyzer.git
cd vue-document-analyzer
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd server
npm install
cd ..
```

4. Configure environment variables:

- Create a `.env` file in the root directory for frontend:

```
VUE_APP_API_URL=http://localhost:3000/api
```

- Create a `.env` file in the server directory based on the `.env.example`:

```bash
cd server
cp .env.example .env
# Edit .env with your API keys and configuration
```

### Running the Application

1. Start the backend server:

```bash
cd server
npm run dev
```

The server will run on http://localhost:3000.

2. In a new terminal, start the frontend development server:

```bash
npm run serve
```

The frontend will be available at http://localhost:8080.

## Building for Production

1. Build the frontend:

```bash
npm run build
```

The built files will be in the `dist` directory.

2. For production, you can serve the static files from your Express server:

```javascript
// Add to server.js
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
```

## Implementation Details

### Frontend

- Vue 3 with Composition API
- Pinia for state management
- Bootstrap 5 for UI
- Vue Router for navigation

### Backend

- Express.js server
- Azure Document Intelligence for document processing
- Anthropic Claude API for analysis
- Multer for file uploads

## API Endpoints

The backend provides the following endpoints:

- `POST /api/process-document`: Process a document with Azure Document Intelligence
  - Requires `x-azure-endpoint` and `x-azure-key` headers
  - File should be uploaded as `document` in form data

- `POST /api/analyze-with-claude`: Analyze document content with Claude API
  - Requires `x-claude-api-key` header
  - Body should include `question`, `documentText`, and optionally `documentTables` and `documentKeyValuePairs`

## Security Considerations

- API keys are passed via headers and not exposed in frontend code
- Files are processed on the server and then deleted
- In a production environment, add proper authentication and rate limiting

## License

MIT

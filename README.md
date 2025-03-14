# Document Analyzer

A Vue 3 application for document analysis using Azure Document Intelligence and Claude AI. This project demonstrates how to extract text and structured information from documents and perform AI-powered analysis.

## Features

- ✅ Upload documents (PDF, images, Word files)
- ✅ Extract text, tables, and key-value pairs from documents using Azure Document Intelligence
- ✅ Analyze document content with Claude AI
- ✅ Modern Vue 3 application with Composition API
- ✅ State management with Pinia
- ✅ Responsive UI with Bootstrap 5

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

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your API configuration (optional for development):

```
VUE_APP_AZURE_ENDPOINT=your-azure-endpoint
VUE_APP_AZURE_KEY=your-azure-key
VUE_APP_CLAUDE_API_KEY=your-claude-api-key
```

### Development

Run the development server:

```bash
npm run serve
```

The application will be available at http://localhost:8080.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Implementation Details

### Frontend

- Vue 3 with Composition API
- Pinia for state management
- Bootstrap 5 for UI
- Vue Router for navigation

### Backend Integration

This frontend application is designed to work with a backend service that handles:

1. Document processing with Azure Document Intelligence
2. Analysis with Claude API

**Note**: The current implementation uses simulated API responses for demonstration purposes. In a production environment, you would need to implement a proper backend service.

## Backend Implementation (To Be Developed)

The backend service should provide the following endpoints:

- `POST /api/process-document`: Process a document with Azure Document Intelligence
- `POST /api/analyze-with-claude`: Analyze document content with Claude API

## Security Considerations

- API keys should never be exposed in the frontend code in a production environment
- All API requests should be proxied through a secure backend
- Use environment variables and proper authentication for API access

## License

MIT

# Document Analyzer (Client-Only Demo)

A Vue 3 application for document analysis using Azure Document Intelligence and Claude AI. This project demonstrates how to extract text and structured information from documents and perform AI-powered analysis, all directly from the browser without a backend server.

## Features

- ✅ Upload documents (PDF, images, Word files)
- ✅ Extract text, tables, and key-value pairs from documents using Azure Document Intelligence
- ✅ Analyze document content with Claude AI
- ✅ Modern Vue 3 application with Composition API
- ✅ State management with Pinia
- ✅ Responsive UI with Bootstrap 5
- ✅ Client-only approach (no backend needed)

## Project Setup

### Prerequisites

- Node.js and npm installed
- Access to Azure Document Intelligence API and Claude API (keys will be entered by users)

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

### Running the Application

Start the development server:

```bash
npm run serve
```

The application will be available at http://localhost:8080.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service like GitHub Pages, Netlify, or Vercel.

## Implementation Details

### Frontend

- Vue 3 with Composition API
- Pinia for state management
- Bootstrap 5 for UI
- Vue Router for navigation

### API Integration

This application takes a client-only approach where:

1. Users enter their own API keys in the application
2. Keys are stored in the browser's localStorage (client-side only)
3. API calls are made directly from the browser to the services
4. No backend server is required

For a real-world production application, a backend server would be recommended to securely handle API keys and sensitive document data.

### CORS Considerations

For demo purposes, if you encounter CORS issues with direct API calls, the application will fall back to using mock data. In a production environment, you would need to ensure your API providers allow cross-origin requests from your domain.

## Security Notes

- API keys are stored in the user's browser localStorage
- Keys are only used on the client's device and not transmitted elsewhere
- For demonstration purposes only; a server-side approach is recommended for production applications

## License

MIT

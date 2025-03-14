require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');
const { Anthropic } = require('anthropic');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Process document with Azure Document Intelligence
app.post('/api/process-document', upload.single('document'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No document file uploaded' });
    }
    
    // Get Azure credentials from request headers
    const azureEndpoint = req.headers['x-azure-endpoint'];
    const azureKey = req.headers['x-azure-key'];
    
    if (!azureEndpoint || !azureKey) {
      return res.status(400).json({ error: 'Azure credentials are required' });
    }
    
    // Initialize Azure Document Intelligence client
    const client = new DocumentAnalysisClient(
      azureEndpoint,
      new AzureKeyCredential(azureKey)
    );
    
    // Get file path
    const filePath = req.file.path;
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Process the document
    const poller = await client.beginAnalyzeDocument('prebuilt-document', fileBuffer);
    const result = await poller.pollUntilDone();
    
    // Extract text content
    let documentText = '';
    for (const page of result.pages) {
      for (const line of page.lines || []) {
        documentText += line.content + '\\n';
      }
    }
    
    // Extract tables
    const documentTables = [];
    if (result.tables) {
      for (const table of result.tables) {
        const tableData = [];
        
        // Get number of rows and columns
        const rowCount = Math.max(...table.cells.map(cell => cell.rowIndex)) + 1;
        const colCount = Math.max(...table.cells.map(cell => cell.columnIndex)) + 1;
        
        // Initialize table with empty cells
        for (let i = 0; i < rowCount; i++) {
          const row = new Array(colCount).fill('');
          tableData.push(row);
        }
        
        // Fill in cell values
        for (const cell of table.cells) {
          const { rowIndex, columnIndex, content } = cell;
          tableData[rowIndex][columnIndex] = content;
        }
        
        documentTables.push(tableData);
      }
    }
    
    // Extract key-value pairs
    const documentKeyValuePairs = [];
    if (result.keyValuePairs) {
      for (const kvp of result.keyValuePairs) {
        if (kvp.key && kvp.value) {
          documentKeyValuePairs.push({
            key: kvp.key.content,
            value: kvp.value.content
          });
        }
      }
    }
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    // Return the result
    res.json({
      documentText,
      documentTables,
      documentKeyValuePairs
    });
    
  } catch (error) {
    console.error('Error processing document:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
});

// Analyze with Claude
app.post('/api/analyze-with-claude', async (req, res) => {
  try {
    // Get document data and question from request body
    const { question, documentText, documentTables, documentKeyValuePairs } = req.body;
    
    // Get Claude API key from request headers
    const claudeApiKey = req.headers['x-claude-api-key'];
    
    if (!claudeApiKey) {
      return res.status(400).json({ error: 'Claude API key is required' });
    }
    
    if (!documentText) {
      return res.status(400).json({ error: 'Document text is required' });
    }
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: claudeApiKey
    });
    
    // Format the prompt for Claude
    let prompt = `I'm going to provide you with text extracted from a document. I'd like you to answer a question about this document.

Document text:
${documentText}

`;

    // Add tables if available
    if (documentTables && documentTables.length > 0) {
      prompt += `\\nTables from the document:\\n`;
      documentTables.forEach((table, index) => {
        prompt += `Table ${index + 1}:\\n`;
        table.forEach(row => {
          prompt += row.join(' | ') + '\\n';
        });
        prompt += '\\n';
      });
    }
    
    // Add key-value pairs if available
    if (documentKeyValuePairs && documentKeyValuePairs.length > 0) {
      prompt += `\\nKey-value pairs from the document:\\n`;
      documentKeyValuePairs.forEach(pair => {
        prompt += `${pair.key}: ${pair.value}\\n`;
      });
    }
    
    // Add the question
    prompt += `\\nQuestion: ${question}

Please provide a thoughtful, comprehensive analysis based on the document content.`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });
    
    // Extract and return Claude's response
    res.json({
      analysis: response.content[0].text
    });
    
  } catch (error) {
    console.error('Error analyzing with Claude:', error);
    res.status(500).json({ error: 'Failed to analyze with Claude' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

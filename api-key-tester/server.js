const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Key validation endpoint
app.post('/api/validate-key', async (req, res) => {
  const { apiKey, service } = req.body;
  
  try {
    const isValid = await validateApiKey(apiKey, service);
    
    if (isValid) {
      res.json({ 
        valid: true, 
        message: 'API Key is valid!',
        service: service
      });
    } else {
      res.status(401).json({ 
        valid: false, 
        message: 'Invalid API Key',
        service: service
      });
    }
  } catch (error) {
    console.error('Validation error:', error.message);
    res.status(500).json({ 
      valid: false, 
      message: 'Error validating API key: ' + error.message,
      service: service
    });
  }
});

// Actual API key validation
async function validateApiKey(apiKey, service) {
  try {
    switch (service) {
      case 'google':
        // Google API key validation using Google Maps API
        try {
          const googleResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=New+York&key=${apiKey}`, {
            timeout: 5000 // 5 second timeout
          });
          // Valid if we get a successful response and it's not a bad request due to key
          return googleResponse.status === 200 && 
                 (!googleResponse.data.error_message || !googleResponse.data.error_message.includes('API key'));
        } catch (error) {
          // Check if it's specifically an API key error
          if (error.response && error.response.data && error.response.data.error_message) {
            // If the error message mentions API key issues, it's invalid
            return !error.response.data.error_message.includes('API key');
          }
          // For other errors (network timeouts, etc.), we can't definitively say the key is invalid
          throw error;
        }
        
      case 'openai':
        // OpenAI API key validation
        try {
          const openaiResponse = await axios.get('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`
            },
            timeout: 5000 // 5 second timeout
          });
          return openaiResponse.status === 200;
        } catch (error) {
          // If we get a 403, it might mean the key is valid but lacks permissions
          // If we get a 401, the key is invalid
          if (error.response && error.response.status === 401) {
            return false; // Definitely invalid
          }
          if (error.response && error.response.status === 403) {
            return true; // Valid but restricted
          }
          // For other errors, we can't definitively say
          throw error;
        }
        
      case 'github':
        // GitHub token validation
        try {
          const githubResponse = await axios.get('https://api.github.com/user', {
            headers: {
              'Authorization': `token ${apiKey}`
          },
            timeout: 5000 // 5 second timeout
          });
          return githubResponse.status === 200;
        } catch (error) {
          // If we get a 401, the token is invalid
          if (error.response && error.response.status === 401) {
            return false;
          }
          // For other errors, we can't definitively say
          throw error;
        }
        
      case 'groq':
        // Groq API key validation
        try {
          const groqResponse = await axios.get('https://api.groq.com/openai/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`
            },
            timeout: 5000 // 5 second timeout
          });
          return groqResponse.status === 200;
        } catch (error) {
          // If we get a 401, the key is invalid
          if (error.response && error.response.status === 401) {
            return false;
          }
          // If we get a 403, it might mean the key is valid but lacks permissions
          if (error.response && error.response.status === 403) {
            return true; // Valid but restricted
          }
          // For other errors, we can't definitively say
          throw error;
        }
        
      case 'anthropic':
        // Anthropic API key validation
        try {
          const anthropicResponse = await axios.get('https://api.anthropic.com/v1/models', {
            headers: {
              'x-api-key': `${apiKey}`,
              'anthropic-version': '2023-06-01'
            },
            timeout: 5000 // 5 second timeout
          });
          return anthropicResponse.status === 200;
        } catch (error) {
          // If we get a 401, the key is invalid
          if (error.response && error.response.status === 401) {
            return false;
          }
          // If we get a 403, it might mean the key is valid but lacks permissions
          if (error.response && error.response.status === 403) {
            return true; // Valid but restricted
          }
          // For other errors, we can't definitively say
          throw error;
        }
        
      case 'aws':
        // For AWS, we'll do a simple format check as actual validation requires signing requests
        // This is a basic check - a real AWS key should start with AKIA and be 20 characters
        return typeof apiKey === 'string' && apiKey.startsWith('AKIA') && apiKey.length === 20;
        
      default:
        // For demo purposes, keep the old validation for unknown services
        const validKeys = {
          'openai': ['sk-demo-openai-valid-key-12345'],
          'google': ['AIzaSyDemoGoogleValidKey1234567890'],
          'github': ['ghp_demo_github_valid_token_1234567890abcdef'],
          'groq': ['gsk_demo_groq_valid_key_1234567890'],
          'anthropic': ['sk-ant-demo-anthropic-valid-key-12345'],
          'aws': ['AKIADEMOAWSVALIDKEY123456']
        };
        
        return validKeys[service] && validKeys[service].includes(apiKey);
    }
  } catch (error) {
    // If we get an authentication error, the key is invalid
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return false;
    }
    // For network errors or other issues, we can't definitively say the key is invalid
    // We'll treat these as validation errors rather than invalid keys
    throw error;
  }
}

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
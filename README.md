# API Key Validator

A beautiful UI application to test if API keys are valid for various services including OpenAI, Google Cloud, GitHub, Groq, Anthropic, and AWS.

## Features

- ✅ Validate API keys for multiple services
- 🎨 Beautiful and responsive user interface
- 🔒 Secure client-side validation
- 🚀 Easy to set up and run locally
- 🌐 Supports popular AI and cloud services:
  - OpenAI
  - Google Cloud
  - GitHub
  - Groq
  - Anthropic
  - AWS

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd api-key-tester
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

1. Select a service provider from the dropdown menu
2. Enter your API key in the input field
3. Click the "Validate Key" button
4. View the results to see if your key is valid

## Important Note About API Keys

⚠️ **To properly validate your own API keys, you must replace the demo keys in the server code with your actual API keys.**

The application comes with demo keys for testing purposes, but these will not work for validating your actual API keys. The server performs real API calls to validate keys, so you'll need to use valid keys for the services you want to test.

For production use, you should implement proper authentication and security measures to protect your API keys.

## Supported Services

| Service | Validation Method |
|---------|-------------------|
| OpenAI | Calls the models endpoint |
| Google Cloud | Calls the Geocoding API |
| GitHub | Calls the user endpoint |
| Groq | Calls the models endpoint |
| Anthropic | Calls the models endpoint |
| AWS | Validates key format (starts with AKIA, 20 characters) |

## Project Structure

```
api-key-tester/
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── server.js
├── package.json
└── README.md
```

## Customization

To add support for additional services:
1. Add a new case in the `validateApiKey` function in [server.js](file:///c:/Projectss/API%20test/api-key-tester/server.js)
2. Add the service to the dropdown in [index.html](file:///c:/Projectss/API%20test/api-key-tester/public/index.html)

## Troubleshooting

- If you get "Invalid API Key" errors, ensure you're using a valid key for the selected service
- Make sure you have internet connectivity to reach the service APIs
- Check the browser console and server logs for detailed error messages

## Author

AK DINESH   https://github.com/akdinesh2003


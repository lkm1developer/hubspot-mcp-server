# HubSpot MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![HubSpot API](https://img.shields.io/badge/HubSpot%20API-v3-orange.svg)](https://developers.hubspot.com/docs/api/overview)
[![MCP SDK](https://img.shields.io/badge/MCP%20SDK-1.8.0-green.svg)](https://github.com/modelcontextprotocol/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful Model Context Protocol (MCP) server implementation for seamless HubSpot CRM integration, enabling AI assistants to interact with your HubSpot data.

## Overview

This MCP server provides a comprehensive set of tools for interacting with the HubSpot CRM API, allowing AI assistants to:

- Create and manage contacts and companies in your HubSpot CRM
- Retrieve detailed company activity history and engagement timelines
- Access recent engagement data across your entire HubSpot instance
- Get lists of recently active companies and contacts
- Perform CRM operations without leaving your AI assistant interface

## Why Use This MCP Server?

- **Seamless AI Integration**: Connect your AI assistants directly to your HubSpot CRM data
- **Simplified CRM Operations**: Perform common HubSpot tasks through natural language commands
- **Real-time Data Access**: Get up-to-date information from your HubSpot instance
- **Secure Authentication**: Uses HubSpot's secure API token authentication
- **Extensible Design**: Easily add more HubSpot API capabilities as needed

## Installation

```bash
# Clone the repository
git clone https://github.com/lkm1developer/hubspot-mcp-server.git
cd hubspot-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

The server requires a HubSpot API access token. You can obtain one by:

1. Going to your [HubSpot Developer Account](https://developers.hubspot.com/)
2. Creating a private app with the necessary scopes (contacts, companies, engagements)
3. Copying the generated access token

You can provide the token in two ways:

1. As an environment variable:
   ```
   HUBSPOT_ACCESS_TOKEN=your-access-token
   ```

2. As a command-line argument:
   ```
   npm start -- --access-token=your-access-token
   ```

For development, create a `.env` file in the project root to store your environment variables:

```
HUBSPOT_ACCESS_TOKEN=your-access-token
```

## Usage

### Starting the Server

```bash
# Start the server
npm start

# Or with a specific access token
npm start -- --access-token=your-access-token
```

### Integrating with AI Assistants

This MCP server is designed to work with AI assistants that support the Model Context Protocol. Once running, the server exposes a set of tools that can be used by compatible AI assistants to interact with your HubSpot CRM data.

### Available Tools

The server exposes the following powerful HubSpot integration tools:

1. **hubspot_create_contact**
   - Create a new contact in HubSpot with duplicate checking
   - Parameters:
     - `firstname` (string, required): Contact's first name
     - `lastname` (string, required): Contact's last name
     - `email` (string, optional): Contact's email address
     - `properties` (object, optional): Additional contact properties like company, phone, etc.
   - Example:
     ```json
     {
       "firstname": "John",
       "lastname": "Doe",
       "email": "john.doe@example.com",
       "properties": {
         "company": "Acme Inc",
         "phone": "555-123-4567",
         "jobtitle": "Software Engineer"
       }
     }
     ```

2. **hubspot_create_company**
   - Create a new company in HubSpot with duplicate checking
   - Parameters:
     - `name` (string, required): Company name
     - `properties` (object, optional): Additional company properties
   - Example:
     ```json
     {
       "name": "Acme Corporation",
       "properties": {
         "domain": "acme.com",
         "industry": "Technology",
         "phone": "555-987-6543",
         "city": "San Francisco",
         "state": "CA"
       }
     }
     ```

3. **hubspot_get_company_activity**
   - Get comprehensive activity history for a specific company
   - Parameters:
     - `company_id` (string, required): HubSpot company ID
   - Returns detailed engagement data including emails, calls, meetings, notes, and tasks

4. **hubspot_get_recent_engagements**
   - Get recent engagement activities across all contacts and companies
   - Parameters:
     - `days` (number, optional, default: 7): Number of days to look back
     - `limit` (number, optional, default: 50): Maximum number of engagements to return
   - Returns a chronological list of all recent CRM activities

5. **hubspot_get_active_companies**
   - Get most recently active companies from HubSpot
   - Parameters:
     - `limit` (number, optional, default: 10): Maximum number of companies to return
   - Returns companies sorted by last modified date

6. **hubspot_get_active_contacts**
   - Get most recently active contacts from HubSpot
   - Parameters:
     - `limit` (number, optional, default: 10): Maximum number of contacts to return
   - Returns contacts sorted by last modified date

## Example Use Cases

### CRM Data Access via AI Assistant

```javascript
// Example of how an AI assistant might use the hubspot_get_active_contacts tool
const result = await useHubspotTool('hubspot_get_active_contacts', { limit: 5 });
console.log("Most recently active contacts:", result);

// Example of creating a new contact
const newContact = await useHubspotTool('hubspot_create_contact', {
  firstname: "Jane",
  lastname: "Smith",
  email: "jane.smith@example.com",
  properties: {
    company: "Acme Inc",
    phone: "555-555-5555"
  }
});
console.log("New contact created:", newContact);
```

See the `examples` directory for more detailed examples of how these tools can be used in various scenarios.

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Check for linting issues
npm run lint
```

## Extending the Server

The server is designed to be easily extensible. To add new HubSpot API capabilities:

1. Add new methods to the `HubSpotClient` class in `src/hubspot-client.ts`
2. Register new tools in the `setupToolHandlers` method in `src/index.ts`
3. Rebuild the project with `npm run build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Keywords

HubSpot, CRM, Model Context Protocol, MCP, AI Assistant, TypeScript, API Integration, HubSpot API, CRM Integration, Contact Management, Company Management, Engagement Tracking, AI Tools

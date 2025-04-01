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

# Run the SSE server with authentication
npx mcp-proxy-auth node dist/index.js
```

### Implementing Authentication in SSE Server

The SSE server uses the [mcp-proxy-auth](https://www.npmjs.com/package/mcp-proxy-auth) package for authentication. To implement authentication:

1. Install the package:
   ```bash
   npm install mcp-proxy-auth
   ```

2. Set the `AUTH_SERVER_URL` environment variable to point to your API key verification endpoint:
   ```bash
   export AUTH_SERVER_URL=https://your-auth-server.com/verify
   ```

3. Run the SSE server with authentication:
   ```bash
   npx mcp-proxy-auth node dist/index.js
   ```

4. The SSE URL will be available at:
   ```
   localhost:8080/sse?apiKey=apikey
   ```

   Replace `apikey` with your actual API key for authentication.

The `mcp-proxy-auth` package acts as a proxy that:
- Intercepts requests to your SSE server
- Verifies API keys against your authentication server
- Only allows authenticated requests to reach your SSE endpoint

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

7. **hubspot_update_contact**
   - Update an existing contact in HubSpot (ignores if contact does not exist)
   - Parameters:
     - `contact_id` (string, required): HubSpot contact ID to update
     - `properties` (object, required): Contact properties to update
   - Example:
     ```json
     {
       "contact_id": "12345",
       "properties": {
         "email": "updated.email@example.com",
         "phone": "555-987-6543",
         "jobtitle": "Senior Software Engineer"
       }
     }
     ```

8. **hubspot_update_company**
   - Update an existing company in HubSpot (ignores if company does not exist)
   - Parameters:
     - `company_id` (string, required): HubSpot company ID to update
     - `properties` (object, required): Company properties to update
   - Example:
     ```json
     {
       "company_id": "67890",
       "properties": {
         "domain": "updated-domain.com",
         "phone": "555-123-4567",
         "industry": "Software",
         "city": "New York",
         "state": "NY"
       }
     }
     ```

## Extending the Server

The server is designed to be easily extensible. To add new HubSpot API capabilities:

1. Add new methods to the `HubSpotClient` class in `src/hubspot-client.ts`
2. Register new tools in the `setupToolHandlers` method in `src/index.ts`
3. Rebuild the project with `npm run build`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Keywords

HubSpot, CRM, Model Context Protocol, MCP, AI Assistant, TypeScript, API Integration, HubSpot API, CRM Integration, Contact Management, Company Management, Engagement Tracking, AI Tools

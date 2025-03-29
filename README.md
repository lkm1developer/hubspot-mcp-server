# HubSpot MCP Server

A Model Context Protocol (MCP) server implementation for HubSpot CRM integration.

## Overview

This MCP server provides tools for interacting with the HubSpot CRM API, allowing you to:

- Create contacts and companies
- Get company activity history
- Retrieve recent engagements
- Get lists of active companies and contacts

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-server-hubspot

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

The server requires a HubSpot API access token. You can provide it in two ways:

1. As an environment variable:
   ```
   HUBSPOT_ACCESS_TOKEN=your-access-token
   ```

2. As a command-line argument:
   ```
   npm start -- --access-token=your-access-token
   ```

You can create a `.env` file in the project root to store your environment variables:

```
HUBSPOT_ACCESS_TOKEN=your-access-token
```

## Usage

### Starting the Server

```bash
# Start the server
npm start
```

### Available Tools

The server exposes the following tools:

1. **hubspot_create_contact**
   - Create a new contact in HubSpot
   - Parameters:
     - `firstname` (string, required): Contact's first name
     - `lastname` (string, required): Contact's last name
     - `email` (string, optional): Contact's email address
     - `properties` (object, optional): Additional contact properties

2. **hubspot_create_company**
   - Create a new company in HubSpot
   - Parameters:
     - `name` (string, required): Company name
     - `properties` (object, optional): Additional company properties

3. **hubspot_get_company_activity**
   - Get activity history for a specific company
   - Parameters:
     - `company_id` (string, required): HubSpot company ID

4. **hubspot_get_recent_engagements**
   - Get recent engagement activities across all contacts and companies
   - Parameters:
     - `days` (number, optional, default: 7): Number of days to look back
     - `limit` (number, optional, default: 50): Maximum number of engagements to return

5. **hubspot_get_active_companies**
   - Get most recently active companies from HubSpot
   - Parameters:
     - `limit` (number, optional, default: 10): Maximum number of companies to return

6. **hubspot_get_active_contacts**
   - Get most recently active contacts from HubSpot
   - Parameters:
     - `limit` (number, optional, default: 10): Maximum number of contacts to return

## Example

See the `simple-test.js` file for a demonstration of how these tools would be used in a client application.

## Development

```bash
# Run in development mode with auto-reload
npm run dev
```

## License

MIT

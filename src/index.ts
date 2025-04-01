#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { HubSpotClient } from './hubspot-client.js';
import dotenv from 'dotenv';
import { parseArgs } from 'node:util';

// Load environment variables
dotenv.config();

// Parse command line arguments
const { values } = parseArgs({
  options: {
    'access-token': { type: 'string' }
  }
});

// Initialize HubSpot client
const accessToken = values['access-token'] || process.env.HUBSPOT_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error('HUBSPOT_ACCESS_TOKEN environment variable is required');
}

class HubSpotServer {
  // Core server properties
  private server: Server;
  private hubspot: HubSpotClient;

  constructor() {
    this.server = new Server(
      {
        name: 'hubspot-manager',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.hubspot = new HubSpotClient(accessToken);

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled rejection at:', promise, 'reason:', reason);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      // Define available tools
      const tools: Tool[] = [
        {
          name: 'hubspot_create_contact',
          description: 'Create a new contact in HubSpot',
          inputSchema: {
            type: 'object',
            properties: {
              firstname: { 
                type: 'string', 
                description: "Contact's first name" 
              },
              lastname: { 
                type: 'string', 
                description: "Contact's last name" 
              },
              email: { 
                type: 'string', 
                description: "Contact's email address" 
              },
              properties: { 
                type: 'object', 
                description: 'Additional contact properties',
                additionalProperties: true
              }
            },
            required: ['firstname', 'lastname']
          }
        },
        {
          name: 'hubspot_create_company',
          description: 'Create a new company in HubSpot',
          inputSchema: {
            type: 'object',
            properties: {
              name: { 
                type: 'string', 
                description: 'Company name' 
              },
              properties: { 
                type: 'object', 
                description: 'Additional company properties',
                additionalProperties: true
              }
            },
            required: ['name']
          }
        },
        {
          name: 'hubspot_get_company_activity',
          description: 'Get activity history for a specific company',
          inputSchema: {
            type: 'object',
            properties: {
              company_id: { 
                type: 'string', 
                description: 'HubSpot company ID' 
              }
            },
            required: ['company_id']
          }
        },
        {
          name: 'hubspot_get_recent_engagements',
          description: 'Get recent engagement activities across all contacts and companies',
          inputSchema: {
            type: 'object',
            properties: {
              days: { 
                type: 'number', 
                description: 'Number of days to look back (default: 7)',
                default: 7
              },
              limit: { 
                type: 'number', 
                description: 'Maximum number of engagements to return (default: 50)',
                default: 50
              }
            }
          }
        },
        {
          name: 'hubspot_get_active_companies',
          description: 'Get most recently active companies from HubSpot',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { 
                type: 'number', 
                description: 'Maximum number of companies to return (default: 10)',
                default: 10
              }
            }
          }
        },
        {
          name: 'hubspot_get_active_contacts',
          description: 'Get most recently active contacts from HubSpot',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { 
                type: 'number', 
                description: 'Maximum number of contacts to return (default: 10)',
                default: 10
              }
            }
          }
        },
        {
          name: 'hubspot_update_contact',
          description: 'Update an existing contact in HubSpot (ignores if contact does not exist)',
          inputSchema: {
            type: 'object',
            properties: {
              contact_id: { 
                type: 'string', 
                description: 'HubSpot contact ID to update' 
              },
              properties: { 
                type: 'object', 
                description: 'Contact properties to update',
                additionalProperties: true
              }
            },
            required: ['contact_id', 'properties']
          }
        },
        {
          name: 'hubspot_update_company',
          description: 'Update an existing company in HubSpot (ignores if company does not exist)',
          inputSchema: {
            type: 'object',
            properties: {
              company_id: { 
                type: 'string', 
                description: 'HubSpot company ID to update' 
              },
              properties: { 
                type: 'object', 
                description: 'Company properties to update',
                additionalProperties: true
              }
            },
            required: ['company_id', 'properties']
          }
        }
      ];
      
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const args = request.params.arguments ?? {};

        switch (request.params.name) {
          case 'hubspot_create_contact': {
            const result = await this.hubspot.createContact(
              args.firstname as string,
              args.lastname as string,
              args.email as string | undefined,
              args.properties as Record<string, any> | undefined
            );
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }
          
          case 'hubspot_create_company': {
            const result = await this.hubspot.createCompany(
              args.name as string,
              args.properties as Record<string, any> | undefined
            );
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }
          
          case 'hubspot_get_company_activity': {
            const result = await this.hubspot.getCompanyActivity(args.company_id as string);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }
          
          case 'hubspot_get_recent_engagements': {
            const result = await this.hubspot.getRecentEngagements(
              args.days as number | undefined,
              args.limit as number | undefined
            );
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }
          
          case 'hubspot_get_active_companies': {
            const result = await this.hubspot.getRecentCompanies(args.limit as number | undefined);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }
          
          case 'hubspot_get_active_contacts': {
            const result = await this.hubspot.getRecentContacts(args.limit as number | undefined);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }
          
          case 'hubspot_update_contact': {
            const result = await this.hubspot.updateContact(
              args.contact_id as string,
              args.properties as Record<string, any>
            );
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }
          
          case 'hubspot_update_company': {
            const result = await this.hubspot.updateCompany(
              args.company_id as string,
              args.properties as Record<string, any>
            );
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2)
              }]
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error: any) {
        console.error(`Error executing tool ${request.params.name}:`, error);
        return {
          content: [{
            type: 'text',
            text: `HubSpot API error: ${error.message}`
          }],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('HubSpot MCP server started');
  }
}
export async function serve(): Promise<void> {
  const client = new HubSpotServer();
  await client.run();
}
const server = new HubSpotServer();
server.run().catch(console.error);

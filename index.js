#!/usr/bin/env node

/**
 * Investoday MCP Server - stdio proxy
 * 
 * This script acts as a bridge between MCP clients (like Cline) using stdio transport
 * and Investoday's remote Streamable HTTP MCP service.
 * 
 * Uses the official @modelcontextprotocol/sdk for stable remote connection.
 */

const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { StreamableHTTPClientTransport } = require('@modelcontextprotocol/sdk/client/streamableHttp.js');

// Configuration from environment variables
const DEFAULT_BASE_URL = 'https://data-api.investoday.net/data/mcp/preset';
const BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;
const API_KEY = process.env.API_KEY;
const DEBUG = process.env.DEBUG === 'true';

// Debug logging (to stderr, not stdout)
function log(...args) {
  if (DEBUG) {
    console.error('[investoday-mcp]', ...args);
  }
}

// Validate API Key
if (!API_KEY) {
  console.error('[investoday-mcp] Error: API_KEY environment variable is required.');
  process.exit(1);
}

// Construct full URL with apiKey query parameter
const FULL_URL = `${BASE_URL}?apiKey=${encodeURIComponent(API_KEY)}`;

log('Starting Investoday MCP stdio proxy');
log('Base URL:', BASE_URL);

/**
 * Main function to set up the proxy
 */
async function main() {
  // Create the remote transport to connect to Investoday's Streamable HTTP service
  const remoteTransport = new StreamableHTTPClientTransport(new URL(FULL_URL));

  // Create a client to connect to the remote server
  const client = new Client({
    name: 'investoday-mcp-proxy',
    version: '1.0.0'
  });

  // Create stdio transport for local MCP client communication
  const stdioTransport = new StdioServerTransport();

  // Forward messages from stdio to remote
  stdioTransport.onmessage = async (message) => {
    log('Received from stdio:', JSON.stringify(message));
    try {
      await remoteTransport.send(message);
    } catch (error) {
      log('Error sending to remote:', error.message);
    }
  };

  // Forward messages from remote to stdio
  remoteTransport.onmessage = async (message) => {
    log('Received from remote:', JSON.stringify(message));
    try {
      await stdioTransport.send(message);
    } catch (error) {
      log('Error sending to stdio:', error.message);
    }
  };

  // Handle errors
  remoteTransport.onerror = (error) => {
    log('Remote transport error:', error.message);
  };

  stdioTransport.onerror = (error) => {
    log('Stdio transport error:', error.message);
  };

  // Handle close
  remoteTransport.onclose = () => {
    log('Remote transport closed');
    process.exit(0);
  };

  stdioTransport.onclose = () => {
    log('Stdio transport closed');
    remoteTransport.close();
    process.exit(0);
  };

  try {
    // Start both transports
    log('Starting transports...');
    await remoteTransport.start();
    log('Remote transport started');
    await stdioTransport.start();
    log('Stdio transport started');
  } catch (error) {
    log('Failed to start transports:', error.message);
    console.error('[investoday-mcp] Failed to connect:', error.message);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('Received SIGINT, exiting');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, exiting');
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log('Uncaught exception:', error.message);
  console.error('[investoday-mcp] Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log('Unhandled rejection:', reason);
  console.error('[investoday-mcp] Unhandled rejection:', reason);
  process.exit(1);
});

// Run main
main().catch((error) => {
  log('Main error:', error.message);
  console.error('[investoday-mcp] Error:', error.message);
  process.exit(1);
});

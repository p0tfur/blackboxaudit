import { defineEventHandler, readBody, getQuery } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    // Get URL from query parameters
    const query = getQuery(event)
    const targetUrl = query.url as string
    
    if (!targetUrl) {
      return {
        error: 'URL parameter is required'
      }
    }
    
    // Make the request to the target URL
    const response = await axios.get(targetUrl, {
      timeout: 10000,
      validateStatus: () => true, // Accept any status code
      headers: {
        'User-Agent': 'BlackBoxAudit Security Scanner'
      },
      // Ensure we get all headers in the response
      decompress: true,
      maxRedirects: 5
    })
    
    // Return the response data, headers, and status
    // Make sure headers are properly serialized for case-insensitive comparison
    console.log('DEBUG - Original headers from response:', JSON.stringify(response.headers, null, 2));
    const serializedHeaders = {};
    Object.keys(response.headers).forEach(key => {
      serializedHeaders[key.toLowerCase()] = response.headers[key];
    });
    console.log('DEBUG - Serialized headers:', JSON.stringify(serializedHeaders, null, 2));
    
    return {
      data: response.data,
      headers: serializedHeaders,
      status: response.status
    }
  } catch (error: any) {
    console.error('Proxy Error:', error);
    // Return a more structured error response
    let errorMessage = 'Failed to fetch URL';
    if (axios.isAxiosError(error)) {
      errorMessage = error.message;
      if (error.response) {
        // Include status code if available
        errorMessage += ` (Status: ${error.response.status})`;
      } else if (error.request) {
        // Network error or timeout
        errorMessage = 'Network error or timeout while fetching URL';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      error: errorMessage
    }
  }
})
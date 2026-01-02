import { defineEventHandler, getQuery } from "h3";
import axios from "axios";
import * as https from "https";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const targetUrl = query.url as string;

    if (!targetUrl) {
      return { error: "URL parameter is required" };
    }

    let certInfo = null;
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await axios.get(targetUrl, {
      timeout: 10000,
      validateStatus: () => true,
      headers: {
        "User-Agent": "BlackBoxAudit Security Scanner",
      },
      decompress: true,
      maxRedirects: 5,
      httpsAgent: agent,
    });

    if (targetUrl.startsWith("https")) {
      try {
        const socket = (response.request as any)?.socket as any;
        if (socket && typeof socket.getPeerCertificate === "function") {
          const cert = socket.getPeerCertificate();
          if (cert && Object.keys(cert).length > 0) {
            certInfo = {
              valid_to: cert.valid_to,
              issuer: (cert as any).issuer?.O || (cert as any).issuer?.CN,
              subject: (cert as any).subject?.CN,
              authorized: typeof socket.authorized === "boolean" ? socket.authorized : null,
              authorizationError: socket.authorizationError || null,
            };
          }
        }
      } catch (e) {
        console.error("Cert fetch error:", e);
      }
    }

    const serializedHeaders = {};
    Object.keys(response.headers).forEach((key) => {
      serializedHeaders[key.toLowerCase()] = response.headers[key];
    });

    return {
      data: response.data,
      headers: serializedHeaders,
      status: response.status,
      cert: certInfo,
    };
  } catch (error: any) {
    console.error("Proxy Error:", error);
    // Return a more structured error response
    let errorMessage = "Failed to fetch URL";
    if (axios.isAxiosError(error)) {
      errorMessage = error.message;
      if (error.response) {
        // Include status code if available
        errorMessage += ` (Status: ${error.response.status})`;
      } else if (error.request) {
        // Network error or timeout
        errorMessage = "Network error or timeout while fetching URL";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      error: errorMessage,
    };
  }
});

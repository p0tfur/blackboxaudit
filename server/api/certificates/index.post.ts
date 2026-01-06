import { defineEventHandler, readBody } from 'h3';
import { db } from '../../utils/db';
import { scans, certificates } from '../../database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { url, score, data, scanDuration } = body;

  if (!url || score === undefined || !data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields: url, score, or data",
    });
  }

  const scanId = crypto.randomUUID();
  const certId = crypto.randomUUID();
  const now = new Date();

  // Drizzle with better-sqlite3 is synchronous
  try {
    db.insert(scans).values({
      id: scanId,
      url,
      score,
      data: JSON.stringify(data),
      createdAt: now,
      scanDuration: scanDuration || 0,
    }).run();

    db.insert(certificates).values({
      id: certId,
      scanId,
      isPublic: true,
      createdAt: now,
    }).run();

    return {
      success: true,
      certificateId: certId,
    };
  } catch(e) {
    console.error("Failed to create certificate:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});

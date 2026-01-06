import { defineEventHandler, getRouterParam, createError } from 'h3';
import { db } from '../../utils/db';
import { scans, certificates } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, message: "Missing certificate ID" });
  }

  try {
    const result = db.select({
      certificate: certificates,
      scan: scans,
    })
    .from(certificates)
    .innerJoin(scans, eq(certificates.scanId, scans.id))
    .where(eq(certificates.id, id))
    .get();

    if (!result) {
      throw createError({ statusCode: 404, message: "Certificate not found" });
    }

    return result;
  } catch (e: any) {
    console.error("Error fetching certificate:", e);
    // If it's the 404 above, rethrow. Otherwise 500.
    if (e.statusCode) throw e;
    throw createError({ statusCode: 500, message: "Internal Server Error" });
  }
});

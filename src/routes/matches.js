import { Router } from "express";
import { matches } from "../db/schema.js";
import { eq, desc } from "drizzle-orm"; // ✅ Ajout de desc
import { db } from "../db/db.js";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { getMatchStatus } from "../utils/match-status.js";

export const matchesRouter = Router();
const MAX_LIMIT = 100;

matchesRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid query", details: parsed.error.errors });
  }

  const limit = Math.min(parsed.data.limit ?? 10, MAX_LIMIT);
  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt)) // ✅ Suppression des parenthèses supplémentaires
      .limit(limit);
    return res.json({ matches: data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

matchesRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid match data", details: parsed.error.errors });
  }

  const {
    data: { startTime, endTime, homeScore, awayScore },
  } = parsed;

  try {
    const [enven] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    const matchStatus = getMatchStatus(enven.startTime, enven.endTime); // ✅ Correction
    res.status(201).json({ match: enven, status: matchStatus });
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

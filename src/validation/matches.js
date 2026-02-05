import { z } from "zod";

// Match status constant with lowercase values
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

export const createMatchSchema = z
  .object({
    sport: z.string().min(1, "Sport is required"),
    homeTeam: z.string().min(1, "Home team is required"),
    awayTeam: z.string().min(1, "Away team is required"),
    startTime: z.string().datetime("Invalid start time format"),
    endTime: z.string().datetime("Invalid end time format"),
    homeScore: z.number().int().min(0).optional(),
    awayScore: z.number().int().min(0).optional(),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "Start time must be before end time",
    path: ["endTime"],
  });
// List matches query schema with optional limit
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});
// Match ID parameter schema
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Update score schema
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});

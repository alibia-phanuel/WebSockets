// git checkout -b feat/database-shema
// git commit -m "feat: add database schema"
// git push origin feat/database-shema
// git checkout main
// git merge feat/database-shema || ou sur git.com
// git checkout main
// git pull origin main
// git push origin main



// matchesRouter.get("/", (req, res) => {
//   res.send("Matches route is working!");
// });



// // GET - Récupérer tous les matchs
// matchesRouter.get("/get", async (req, res) => {
//   try {
//     const { status, sport } = req.query;

//     let query = db.select().from(matches);

//     // Filtres optionnels
//     if (status) {
//       query = query.where(eq(matches.status, status));
//     }
//     if (sport) {
//       query = query.where(eq(matches.sport, sport));
//     }

//     const allMatches = await query;

//     res.status(200).json({
//       success: true,
//       count: allMatches.length,
//       data: allMatches,
//     });
//   } catch (error) {
//     console.error("Error fetching matches:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       message:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

// // GET - Récupérer un match par ID
// matchesRouter.get("/:id", async (req, res) => {
//   try {
//     const matchId = parseInt(req.params.id);

//     if (isNaN(matchId)) {
//       return res.status(400).json({ error: "Invalid match ID" });
//     }

//     const [match] = await db
//       .select()
//       .from(matches)
//       .where(eq(matches.id, matchId));

//     if (!match) {
//       return res.status(404).json({ error: "Match not found" });
//     }

//     res.status(200).json({
//       success: true,
//       data: match,
//     });
//   } catch (error) {
//     console.error("Error fetching match:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       message:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

// // POST - Créer un nouveau match
// matchesRouter.post("/", async (req, res) => {
//   try {
//     // Validation avec Zod
//     const parsed = createMatchSchema.safeParse(req.body);

//     if (!parsed.success) {
//       return res.status(400).json({
//         error: "Invalid match data",
//         details: parsed.error.format(),
//       });
//     }

//     const { startTime, endTime, homeScore, awayScore } = parsed.data;

//     // Calcul automatique du statut
//     const status = getMatchStatus(startTime, endTime);

//     // Insertion dans la base de données
//     const [newMatch] = await db
//       .insert(matches)
//       .values({
//         ...parsed.data,
//         startTime: new Date(startTime),
//         endTime: new Date(endTime),
//         homeScore: homeScore ?? 0,
//         awayScore: awayScore ?? 0,
//         status,
//       })
//       .returning();

//     res.status(201).json({
//       success: true,
//       data: newMatch,
//     });
//   } catch (error) {
//     console.error("Error creating match:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       message:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

// // PATCH - Mettre à jour un match
// matchesRouter.patch("/:id", async (req, res) => {
//   try {
//     const matchId = parseInt(req.params.id);

//     if (isNaN(matchId)) {
//       return res.status(400).json({ error: "Invalid match ID" });
//     }

//     // Validation partielle (tous les champs optionnels)
//     const updateSchema = createMatchSchema.partial();
//     const parsed = updateSchema.safeParse(req.body);

//     if (!parsed.success) {
//       return res.status(400).json({
//         error: "Invalid match data",
//         details: parsed.error.format(),
//       });
//     }

//     const [updatedMatch] = await db
//       .update(matches)
//       .set({
//         ...parsed.data,
//         ...(parsed.data.startTime && {
//           startTime: new Date(parsed.data.startTime),
//         }),
//         ...(parsed.data.endTime && { endTime: new Date(parsed.data.endTime) }),
//       })
//       .where(eq(matches.id, matchId))
//       .returning();

//     if (!updatedMatch) {
//       return res.status(404).json({ error: "Match not found" });
//     }

//     res.status(200).json({
//       success: true,
//       data: updatedMatch,
//     });
//   } catch (error) {
//     console.error("Error updating match:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       message:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

// // DELETE - Supprimer un match
// matchesRouter.delete("/:id", async (req, res) => {
//   try {
//     const matchId = parseInt(req.params.id);

//     if (isNaN(matchId)) {
//       return res.status(400).json({ error: "Invalid match ID" });
//     }

//     const [deletedMatch] = await db
//       .delete(matches)
//       .where(eq(matches.id, matchId))
//       .returning();

//     if (!deletedMatch) {
//       return res.status(404).json({ error: "Match not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Match deleted successfully",
//       data: deletedMatch,
//     });
//   } catch (error) {
//     console.error("Error deleting match:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       message:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

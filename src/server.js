import express from "express";
import { matchesRouter } from "./routes/matches.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/matches", matchesRouter);

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});

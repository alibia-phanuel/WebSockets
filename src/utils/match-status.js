import { MATCH_STATUS } from "../validation/matches.js";

export function getMatchStatus(startTime, endTime, now = new Date()) {
  const start = new Date(startTime);

  // Si pas de date de fin, on considère que le match est "live" s'il a commencé
  if (!endTime) {
    return now >= start ? MATCH_STATUS.LIVE : MATCH_STATUS.SCHEDULED;
  }

  const end = new Date(endTime);

  // Validation des dates
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid date format for match times");
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }

  if (now >= end) {
    return MATCH_STATUS.FINISHED;
  }

  return MATCH_STATUS.LIVE;
}

export async function syncMatchStatus(match, updateStatus) {
  try {
    const nextStatus = getMatchStatus(match.startTime, match.endTime);

    if (match.status !== nextStatus) {
      await updateStatus(nextStatus);
      match.status = nextStatus;
    }

    return match.status;
  } catch (error) {
    console.error("Error syncing match status:", error);
    return match.status; // Garde le statut actuel en cas d'erreur
  }
}

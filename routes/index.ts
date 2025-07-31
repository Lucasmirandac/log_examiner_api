import { Router } from "express";
import { LogActivityController } from "../log-activity.controller";

export function setupRoutes(
  logActivityController: LogActivityController
): Router {
  const router = Router();

  // Log Activity routes
  router.get(
    "/summary/:user_id&:start_time&:end_time",
    logActivityController.getUserLogs.bind(logActivityController)
  );

  router.get(
    "/action-trends/:start_time/:end_time",
    logActivityController.getActionTrends.bind(logActivityController)
  );

  return router;
}

import { Router } from "express";
import { LogActivityController } from "../controllers/log-activity.controller";

export function setupRoutes(
  logActivityController: LogActivityController
): Router {
  const router = Router();

  // Log Activity routes
  router.get(
    "/summary",
    logActivityController.getUserLogs.bind(logActivityController)
  );

  router.get(
    "/action-trends",
    logActivityController.getActionTrends.bind(logActivityController)
  );

  return router;
}

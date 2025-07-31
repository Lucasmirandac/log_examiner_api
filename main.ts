import express from "express";
import { LogActivityController } from "./log-activity.controller";
import { Router } from "express";

export class App {
  private readonly app = express();
  private readonly route = Router();

  constructor(private readonly logActivityController: LogActivityController) {
    this.app.use(express.json());
    this.route.get(
      "/summary/:user_id?/:start_time?/:end_time?",
      this.logActivityController.getUserLogs
    );

    this.route.get(
      "/action-trends/:start_time&:end_time",
      this.logActivityController.getActionTrends
    );

    this.app.use(this.route);
    this.app.listen(3333, () => "server running on port 3333");
  }
}

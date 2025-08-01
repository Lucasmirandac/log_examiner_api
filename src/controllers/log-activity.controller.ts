import { GetUserLogsDto } from "../dtos/getUserData/ get-user-logs.dto";

import { Request, Response } from "express";
import { LogActivityService } from "../services/log-activity.service";

export class LogActivityController {
  constructor(private logActivityService: LogActivityService) {}

  async getUserLogs(req: Request, res: Response) {
    try {
      const userId = req.query.user_id as string;
      const startTime = req.query.start_time as string;
      const endTime = req.query.end_time as string;

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      if (startTime && endTime) {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          res
            .status(400)
            .json({ error: "Invalid date format for start_time or end_time" });
          return;
        }

        if (startDate >= endDate) {
          res.status(400).json({ error: "Start time must be before end time" });
          return;
        }
      }

      const body: GetUserLogsDto = {
        user_id: userId,
        start_time: startTime || "",
        end_time: endTime || "",
      };

      const logs = await this.logActivityService.getUserLogs(body);
      res.json(logs);
    } catch (error) {
      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getActionTrends(req: Request, res: Response) {
    try {
      const startTime = req.query.start_time as string;
      const endTime = req.query.end_time as string;

      if (!startTime || !endTime) {
        res.status(400).json({ error: "Start and end time are required" });
        return;
      }

      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res
          .status(400)
          .json({ error: "Invalid date format for start_time or end_time" });
        return;
      }

      if (startDate >= endDate) {
        res.status(400).json({ error: "Start time must be before end time" });
        return;
      }

      const body: GetUserLogsDto = {
        user_id: "", // Not needed for action trends
        start_time: startTime,
        end_time: endTime,
      };

      //const logs = await this.logActivityService.getActionTrends(body);
      //res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

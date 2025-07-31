import { GetUserLogsDto } from "./dtos/getUserData/ get-user-logs.dto";
import { UserLogsResponse } from "./dtos/getUserData/user-logs-response.dto";
import { LogActivityService } from "./log-activity.service";
import express from "express";
import { Router, Request, Response } from "express";

export class LogActivityController {
  constructor(private logActivityService: LogActivityService) {}

  async getUserLogs(req: Request, res: Response) {
    try {
      const body = req.params as unknown as GetUserLogsDto;

      if (!body.user_id) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      if (!body.start_time || !body.end_time) {
        res.status(400).json({ error: "Start and end time are required" });
        return;
      }

      if (body.start_time >= body.end_time) {
        res.status(400).json({ error: "Start time must be before end time" });
        return;
      }
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
      const body = req.params as unknown as GetUserLogsDto;

      if (!body.start_time || !body.end_time) {
        res.status(400).json({ error: "Start and end time are required" });
        return;
      }

      if (body.start_time >= body.end_time) {

      const logs = await this.logActivityService.getActionTrends(body);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

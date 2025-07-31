import { GetUserLogsDto } from "./dtos/getUserData/ get-user-logs.dto";
import { UserLogsResponse } from "./dtos/getUserData/user-logs-response.dto";
import { LogActivity } from "./log-activity.interface";
import { UtilsService } from "./utilsService";

export class LogActivityService {
  private logActivities: LogActivity[] = [];
  private userData: Map<
    string,
    { action: string; timestamp: string; metadata: any }[]
  > = new Map();

  constructor(private readonly utilsService: UtilsService) {}

  async getLogActivities() {
    try {
      const response = await fetch(
        "https://cdn.prod.website-files.com/634d5c356b8adeff5a7c6393/6884a1f50007bdc0d663422c_activities.csv"
      );
      const data = await response.text();

      const parsedData: LogActivity[] = this.utilsService.csvJSON(data);
      this.logActivities = parsedData;
      this.processData(parsedData);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  private processData(data: LogActivity[]) {
    for (const log of data) {
      const { user_id, action, timestamp, metadata } = log;

      if (!this.userData.has(user_id)) {
        this.userData.set(user_id, []);
      }

      this.userData.get(user_id)?.push({ action, timestamp, metadata });
    }
  }

  async getUserLogs(body: GetUserLogsDto): Promise<UserLogsResponse> {
    try {
      const userLogs = this.userData.get(body.user_id);
      if (!userLogs) throw new Error("User not found");

      const filteredLogs = userLogs.filter(
        (log) =>
          log.timestamp >= body.start_time && log.timestamp <= body.end_time
      );

      const actions = filteredLogs.length;

      const mostFrequentAction = this.getMostFrequentAction(filteredLogs);

      const response: UserLogsResponse = {
        totalActions: actions,
        mostFrequentyAction: mostFrequentAction,
        averageDuration: 0,
        mostFrequentPage: "",
      };
      return response;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  private getMostFrequentAction(
    logs: { action: string; timestamp: string; metadata: any }[]
  ): string {
    const actionCount = new Map<string, number>();

    for (const log of logs) {
      actionCount.set(log.action, (actionCount.get(log.action) || 0) + 1);
    }

    let mostFrequentAction = "";
    let maxCount = 0;

    for (const [action, count] of actionCount.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentAction = action;
      }
    }

    return mostFrequentAction;
  }
}

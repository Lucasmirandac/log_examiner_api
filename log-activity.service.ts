import { GetUserLogsDto } from "./dtos/getUserData/ get-user-logs.dto";
import { UserLogsResponse } from "./dtos/getUserData/user-logs-response.dto";
import { GetActionTrendsDto } from "./dtos/getUserTrends/get-user-trends.dto";
import { ActionTrendsResponse } from "./dtos/getUserTrends/user-trends-response.dto";
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
      await this.getLogActivities();

      const userLogs = this.userData.get(body.user_id);
      if (!userLogs) throw new Error("User not found");

      const filteredLogs = userLogs.filter(
        (log) =>
          log.timestamp >= body.start_time && log.timestamp <= body.end_time
      );

      console.log(filteredLogs);

      const actions = filteredLogs.length;

      const mostFrequentAction = this.getMostFrequentAction(filteredLogs);

      const averageDuration = this.getAverageDuration(filteredLogs);

      const mostFrequentPage = this.getMostFrequentPage(filteredLogs);

      const response: UserLogsResponse = {
        totalActions: actions,
        mostFrequentyAction: mostFrequentAction,
        averageDuration: averageDuration,
        mostFrequentPage: mostFrequentPage,
      };
      return response;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  private getMostFrequentPage(
    logs: { action: string; timestamp: string; metadata: any }[]
  ): string {
    const pageCount = new Map<string, number>();

    for (const log of logs) {
      const page = log.metadata.page;
      pageCount.set(page, (pageCount.get(page) || 0) + 1);
    }

    let mostFrequentPage = "";
    let maxCount = 0;

    for (const [page, count] of pageCount.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentPage = page;
      }
    }

    return mostFrequentPage;
  }

  private getAverageDuration(
    logs: { action: string; timestamp: string; metadata: any }[]
  ): number {
    const totalDuration = logs.reduce((acc, log) => {
      const duration =
        new Date(log.timestamp).getTime() -
        new Date(log.metadata.timestamp).getTime();
      return acc + duration;
    }, 0);
    const averageDuration = totalDuration / logs.length;
    console.log(averageDuration);
    return averageDuration;
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

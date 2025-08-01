import express from "express";
import { setupRoutes } from "./routes/index";
import { LogActivityController } from "./controllers/log-activity.controller";
import { LogActivityService } from "./services/log-activity.service";
import { UtilsService } from "./utils/utilsService";

const app = express();
app.use(express.json());

// Initialize services and controllers
const utilsService = new UtilsService();
const logActivityService = new LogActivityService(utilsService);
const logActivityController = new LogActivityController(logActivityService);

// Setup and use routes
const routes = setupRoutes(logActivityController);

app.use("/api", routes);

app.listen(3333, () => {
  console.log("server running on port 3333");
});

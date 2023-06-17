import app from "./app.js";
import fs from "fs";
import https from "https";
import cron from "node-cron";
import {dkpDecay} from "./core/dkpManager.js";

const PORT = process.env.PORT || 8080;

cron.schedule(
  "0 0 * * 2",
  async () => {
    console.log("Running DKP Decay...");
    await dkpDecay();
    console.log("DKP Decay Finished");
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles",
  }
);

if (process.env.NODE_ENV === "staging") {
  https
    .createServer(
      // Provide the private and public key to the server by reading each
      // file's content with the readFileSync() method.
      {
        key: fs.readFileSync("/src/key/privkey.pem"),
        cert: fs.readFileSync("/src/key/fullchain.pem"),
      },
      app
    )
    .listen(PORT, () => {
      console.log(`HTTPS Server is listening on port ${PORT}`);
    });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP Server is listening on port ${PORT}`);
  });
}

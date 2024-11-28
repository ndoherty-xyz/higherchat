import { HubClient } from "./hub-client";

async function main() {
  const client = new HubClient();

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    client.stop();
  });

  console.log("Starting cast client...");
  await client.start();
}

main().catch(console.error);

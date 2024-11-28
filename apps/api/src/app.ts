import cors from "cors";
import express, { Request, Response } from "express";
import { configDotenv } from "dotenv";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql/schema";
import path from "path";
import { fileURLToPath } from "url";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv();

const app = express();
const PORT = process.env.PORT;

// Use JSON parser for all non-webhook routes
app.use(express.json());
app.use(express.urlencoded());

// Cors configuration
app.use(cors());

// Create neynar client
if (!process.env.NEYNAR_API_KEY) throw new Error("No Neynar API key in ENV");
export const neynarClient = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY,
});

const yoga = createYoga({
  schema: schema,
  graphiql: process.env.NODE_ENV !== "production",
  graphqlEndpoint: "/api/graphql",
  context: async (ctx) => {
    const authHeader = ctx.request.headers.get("higherchat-auth");

    let user = undefined;
    if (authHeader) {
      const [fid, signerUuid] = authHeader.split(":::");
      if (fid && signerUuid) {
        user = {
          fid: Number(fid),
          signerUuid,
        };
      }
    }

    return {
      user,
      ...ctx,
    };
  },
});

app.use(yoga.graphqlEndpoint, yoga);

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
    console.log("Graphql endpoint is: ", yoga.graphqlEndpoint);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });

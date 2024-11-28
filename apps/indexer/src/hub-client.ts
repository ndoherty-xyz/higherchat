import {
  createDefaultMetadataKeyInterceptor,
  getSSLHubRpcClient,
  HubEvent,
  HubEventType,
  isCastAddMessage,
  isMergeMessageHubEvent,
} from "@farcaster/hub-nodejs";
import { prisma, PrismaClient } from "@higherchat/db";
import { configDotenv } from "dotenv";
import { farcasterTimeToDate } from "utils";

configDotenv();

export class HubClient {
  private hubClient;
  private prisma: PrismaClient;
  private stopped = false;

  constructor() {
    this.hubClient = getSSLHubRpcClient("hub-grpc-api.neynar.com", {
      interceptors: [
        createDefaultMetadataKeyInterceptor(
          "x-api-key",
          process.env.NEYNAR_API_KEY!
        ),
      ],
    });
    this.prisma = prisma;
  }

  async start() {
    // Subscribe to all merge message events
    const result = await this.hubClient.subscribe({
      eventTypes: [HubEventType.MERGE_MESSAGE],
    });

    if (result.isErr()) {
      throw new Error(`Failed to subscribe to hub: ${result.error}`);
    }

    const stream = result.value;

    // Process events as they come in
    for await (const event of stream) {
      if (this.stopped) break;

      try {
        await this.processEvent(event);
      } catch (err) {
        console.error("Error processing event:", err);
      }
    }
  }

  private async processEvent(event: HubEvent) {
    // Only process merge message events that are casts
    if (!isMergeMessageHubEvent(event)) return;

    const message = event.mergeMessageBody?.message;
    if (!message || !isCastAddMessage(message)) return;

    // We are only listening to the network for aethernet's messages. All other messages will be sent through our api.
    if (message.data.fid !== 862185) return;

    // Eventually, we will add a check in here that the aethernet cast is replying to an existing user message
    const parentHash = message.data.castAddBody.parentCastId?.hash;

    if (!parentHash) {
      console.log("Aether is talking to themselves!");
      return; // If not replying to anyone, skip
    }

    const hexParentHash = `0x${Buffer.from(parentHash).toString("hex")}`;
    const replyToUserMessage = await prisma.userMessages.findUnique({
      where: {
        castHash: hexParentHash,
      },
    });

    if (!replyToUserMessage) {
      console.log("Aether not replying to a user message, dont store.");
      return; // If not replying to an existing user message, skip
    }

    // Store in database
    await this.prisma.aetherMessages.create({
      data: {
        conversation_id: replyToUserMessage.conversation_id,
        castHash: `0x${Buffer.from(message.hash).toString("hex")}`,
        message_text: message.data.castAddBody?.text || "",
        timestamp: farcasterTimeToDate(message.data.timestamp),
      },
    });
  }

  stop() {
    this.stopped = true;
  }
}

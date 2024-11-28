import { builder, MutationBuilderArg } from "graphql/builder";
import { Conversation, prisma } from "@higherchat/db";
import { neynarClient } from "app";

// Types

const ConversationType = builder
  .objectRef<Conversation>("ConversationType")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      ownerFid: t.exposeInt("conversation_owner_fid"),
    }),
  });

// Utils

// Endpoints

export const createNewConversationBuilder = (t: MutationBuilderArg) => {
  return t.field({
    type: ConversationType,
    args: { firstMessage: t.arg.string({ required: true }) },
    resolve: async (_, args, ctx) => {
      // NEED TO REQUIRE AUTH HERE

      // create the cast, and on success, start a new conversation
      const publishedCast = await neynarClient.publishCast({
        signerUuid: process.env.HIGHERCHAT_SIGNER_UUID!,
        text: `@aethernet ${args.firstMessage}`,
      });

      if (!publishedCast.success)
        throw new Error("Couldn't start a new conversation!");

      const conversation = await prisma.conversation.create({
        data: {
          conversation_owner_fid: 888149,
          UserMessages: {
            create: {
              castHash: publishedCast.cast.hash,
              message_text: publishedCast.cast.text,
              timestamp: new Date(),
            },
          },
        },
      });

      return conversation;
    },
  });
};

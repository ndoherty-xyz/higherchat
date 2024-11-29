import { builder, MutationBuilderArg } from "graphql/builder";
import { Conversation, prisma } from "@higherchat/db";
import { neynarClient } from "app";
import {
  ConversationWithMessagesType,
  formatConversationMessages,
} from "./get";
import { requireAuth } from "utils/requireAuth";

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
      const authUser = await requireAuth(ctx);

      // create the cast, and on success, start a new conversation
      const publishedCast = await neynarClient.publishCast({
        signerUuid: authUser.signerUuid,
        text: `@aethernet ${args.firstMessage}`,
      });

      if (!publishedCast.success)
        throw new Error("Couldn't start a new conversation!");

      const conversation = await prisma.conversation.create({
        data: {
          conversation_owner_fid: authUser.fid,
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

export const sendNewMessageBuilder = (t: MutationBuilderArg) => {
  return t.field({
    type: ConversationWithMessagesType,
    args: {
      conversationId: t.arg.string({ required: true }),
      message: t.arg.string({ required: true }),
      previousMessageHash: t.arg.string({ required: true }),
    },
    resolve: async (_, args, ctx) => {
      const authUser = await requireAuth(ctx);

      // Check conversation exists and user is owner of it
      const conversation = await prisma.conversation.findUniqueOrThrow({
        where: {
          id: args.conversationId,
          conversation_owner_fid: authUser.fid,
        },
      });

      // Send the cast
      const publishedCast = await neynarClient.publishCast({
        signerUuid: authUser.signerUuid,
        text: args.message,
        parent: args.previousMessageHash,
      });

      if (!publishedCast.success) throw new Error("Couldn't send message!");

      const conversationWithMessages = await prisma.conversation.update({
        include: {
          UserMessages: true,
          AetherMessages: true,
        },
        where: {
          id: conversation.id,
        },
        data: {
          UserMessages: {
            create: {
              castHash: publishedCast.cast.hash,
              message_text: publishedCast.cast.text,
              timestamp: new Date(),
            },
          },
        },
      });

      const formattedMessages = await formatConversationMessages({
        userFid: authUser.fid,
        aetherMessages: conversationWithMessages.AetherMessages ?? [],
        userMessages: conversationWithMessages.UserMessages ?? [],
      });

      return {
        ...conversation,
        messages: formattedMessages,
      };
    },
  });
};

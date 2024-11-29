import { User } from "@neynar/nodejs-sdk/build/api";
import { builder, QueryBuilderArg } from "graphql/builder";
import { getUser, UserType } from "../users/get";
import {
  AetherMessages,
  Conversation,
  prisma,
  UserMessages,
} from "@higherchat/db";
import { requireAuth } from "utils/requireAuth";
import { AETHER_USER_OBJECT } from "constants/aether";

export type ConversationMessage = {
  user: User;
  messageText: string;
  timestamp: Date;
  castHash: string;
};

export const ConversationMessageType = builder
  .objectRef<ConversationMessage>("ConversationMessageType")
  .implement({
    fields: (t) => ({
      castHash: t.exposeString("castHash"),
      user: t.expose("user", { type: UserType }),
      messageText: t.exposeString("messageText"),
      timestamp: t.string({
        resolve: (root) => root.timestamp.toISOString(),
      }),
    }),
  });

export type ConversationWithMessages = Conversation & {
  messages: ConversationMessage[];
};

export const ConversationWithMessagesType = builder
  .objectRef<ConversationWithMessages>("ConversationWithMessagesType")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      messages: t.expose("messages", { type: [ConversationMessageType] }),
    }),
  });

export const formatConversationMessages = async (args: {
  userFid: number;
  aetherMessages: AetherMessages[];
  userMessages: UserMessages[];
}): Promise<ConversationMessage[]> => {
  const userUserObj = await getUser(args.userFid);

  const userMessages: ConversationMessage[] = args.userMessages.map((msg) => ({
    messageText: msg.message_text,
    timestamp: msg.timestamp,
    castHash: msg.castHash,
    user: userUserObj,
  }));

  const aetherMessages: ConversationMessage[] = args.aetherMessages.map(
    (msg) => ({
      messageText: msg.message_text,
      timestamp: msg.timestamp,
      castHash: msg.castHash,
      user: AETHER_USER_OBJECT,
    })
  );

  const formattedMessages = userMessages
    .concat(aetherMessages)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return formattedMessages;
};

export const getConverstationBuilder = (t: QueryBuilderArg) => {
  return t.field({
    type: ConversationWithMessagesType,
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_, args, ctx) => {
      const authUser = await requireAuth(ctx);

      const conversation = await prisma.conversation.findUniqueOrThrow({
        where: { id: args.id, conversation_owner_fid: authUser.fid },
        include: {
          AetherMessages: true,
          UserMessages: true,
        },
      });

      const formattedMessages = await formatConversationMessages({
        userFid: authUser.fid,
        aetherMessages: conversation.AetherMessages ?? [],
        userMessages: conversation.UserMessages ?? [],
      });

      return {
        ...conversation,
        messages: formattedMessages,
      };
    },
  });
};

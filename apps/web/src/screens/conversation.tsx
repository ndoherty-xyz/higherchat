"use client";

import { Avatar } from "@/components/users/avatar";
import { ConversationWithMessagesDocument } from "@/graphql/_generated_/graphql";
import { useQuery } from "@apollo/client";

export const ConversationScreen = (props: { conversationId: string }) => {
  const { data, startPolling, stopPolling } = useQuery(
    ConversationWithMessagesDocument,
    {
      variables: {
        conversationId: props.conversationId,
      },
      pollInterval: 500,
    }
  );

  return (
    <div>
      {data?.getConversationWithMessages.messages.map((msg) => (
        <div className="flex flex-row gap-[8px]" key={msg.castHash}>
          <Avatar pfpUrl={msg.user.avatarUrl} size="md" />
          {msg.messageText}
        </div>
      ))}
    </div>
  );
};

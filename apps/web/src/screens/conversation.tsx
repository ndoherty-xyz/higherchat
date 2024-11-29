"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/users/avatar";
import {
  ConversationWithMessagesDocument,
  SendMessageDocument,
} from "@/graphql/_generated_/graphql";
import { apolloClient } from "@/graphql/apollo/apollo-client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

export const ConversationScreen = (props: { conversationId: string }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const { data, startPolling, stopPolling } = useQuery(
    ConversationWithMessagesDocument,
    {
      variables: {
        conversationId: props.conversationId,
      },
    }
  );

  useEffect(() => {
    const lastMessage = data?.getConversationWithMessages.messages.at(-1);
    if (lastMessage?.user.username === "aethernet") {
      stopPolling();
      setLoading(false);
    }
  }, [data?.getConversationWithMessages.messages, stopPolling]);

  const submit = useCallback(async () => {
    if (!user) return;
    if (!inputText) return;
    if (!data?.getConversationWithMessages.messages) return;

    const lastCast = data.getConversationWithMessages.messages.at(-1);
    if (!lastCast) return;

    setLoading(true);

    await apolloClient.mutate({
      mutation: SendMessageDocument,
      variables: {
        message: inputText,
        conversationId: props.conversationId,
        previousMessageHash: lastCast.castHash,
      },
      optimisticResponse: (vars) => {
        return {
          __typename: "Mutation",
          sendMessage: {
            ...data.getConversationWithMessages,
            messages: [
              ...data.getConversationWithMessages.messages,
              {
                __typename: "ConversationMessageType",
                castHash: "placeholder",
                timestamp: new Date().toISOString(),
                messageText: vars.message,
                user: user,
              },
            ],
          },
        };
      },
    });
    startPolling(500);
  }, [
    inputText,
    data?.getConversationWithMessages,
    props.conversationId,
    startPolling,
    user,
  ]);

  console.log(data?.getConversationWithMessages.messages);

  return (
    <div className="flex flex-col items-center p-[24px]">
      <div className="flex flex-col max-w-[700px] gap-[16px]">
        {data?.getConversationWithMessages.messages.map((msg) => (
          <div
            className="flex flex-row gap-[12px] items-start p-[12px] rounded-xl border border-stone-200"
            key={msg.castHash}
          >
            <Avatar pfpUrl={msg.user.avatarUrl} size="md" overrideSize={32} />
            <span className="font-brand font-[400] text-lg">
              {msg.messageText}
            </span>
          </div>
        ))}
        {loading ? (
          <div className="w-full flex justify-center mt-[24px] text-green-400">
            <SyncLoader size={12} color="currentColor" />
          </div>
        ) : null}
        <div className="h-[100px]" />
      </div>

      <div className="fixed bottom-0 left-0 w-screen flex justify-center p-[12px] pb-[24px]">
        <div className="flex flex-row gap-[8px] w-[700px]">
          <Input
            className="flex-grow"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button onClick={submit}>Send</Button>
        </div>
      </div>
    </div>
  );
};

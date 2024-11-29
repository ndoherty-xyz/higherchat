"use client";

import { ConversationMessage } from "@/components/auth/conversation/message";
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
      window.scrollTo({
        behavior: "smooth",
        top: document.scrollingElement?.scrollTop,
      });
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
    window.scrollTo({
      behavior: "smooth",
      top: document.scrollingElement?.scrollTop,
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
    <div className="flex flex-col items-center p-[24px] bg-stone-50">
      <div className="flex flex-col max-w-[700px] gap-[16px]">
        {data?.getConversationWithMessages.messages.map((msg) => (
          <ConversationMessage message={msg} key={msg.castHash} />
        ))}
        {loading ? (
          <div className="w-full flex justify-center mt-[24px] text-green-400">
            <SyncLoader size={12} color="currentColor" />
          </div>
        ) : null}
        <div className="h-[100px]" />
      </div>

      <div className="fixed bottom-0 left-0 w-screen flex justify-center">
        <div className="flex flex-row gap-[8px] w-[720px] p-[16px] pb-[24px] rounded-b-none rounded-xl bg-background border border-stone-200 shadow-md">
          <Input
            placeholder="Reply to Aether..."
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

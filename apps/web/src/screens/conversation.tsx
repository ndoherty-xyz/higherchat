"use client";

import { ConversationMessage } from "@/components/conversation/message";
import { Button } from "@/components/ui/button";
import { HigherLogo } from "@/components/ui/icons/higher-logo";
import { Textarea } from "@/components/ui/textarea";
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
  const [loading, setLoading] = useState(true);
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
    startPolling(500);
  }, []);

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
    setInputText("");
    startPolling(500);
  }, [
    inputText,
    data?.getConversationWithMessages,
    props.conversationId,
    startPolling,
    user,
  ]);

  return (
    <div className="flex flex-col items-center p-[16px] sm:p-[24px] pt-[128px] sm:pt-[128px]">
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-gradient -z-10" />
      <div className="pb-[48px] font-brand text-3xl text-center">
        {data?.getConversationWithMessages.createdAt
          ? new Date(
              data.getConversationWithMessages.createdAt
            ).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })
          : null}
      </div>
      <div className="flex flex-col max-w-[600px] gap-[16px]">
        {data?.getConversationWithMessages.messages.map((msg) => (
          <ConversationMessage message={msg} key={msg.castHash} />
        ))}
        {loading ? (
          <div className="w-full flex justify-center mt-[24px] text-stone-800">
            <SyncLoader size={8} color="currentColor" />
          </div>
        ) : null}
        <div className="h-[100px]" />
      </div>

      <div className="fixed bottom-0 left-0 w-screen flex justify-center">
        <div className="flex flex-row gap-[8px] w-[640px] rounded-b-none bg-white/80 backdrop-blur-md rounded-2xl border border-stone-600/50 shadow-md">
          <Textarea
            rows={2}
            onEnter={submit}
            placeholder="Reply to Aether..."
            containerClassName="flex-grow"
            className="text-black w-full flex-grow h-fit max-h-[300px] text-[16px] rounded-none bg-transparent p-[16px] resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {inputText ? (
            <Button
              onClick={submit}
              className="w-[32px] h-[32px] bg-[#018A08] hover:bg-[#018A08] outline outline-2 -outline-offset-1 outline-transparent hover:outline-[#018A08] transition-all text-white mt-[16px] mr-[16px]"
            >
              <HigherLogo size={16} color="currentColor" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

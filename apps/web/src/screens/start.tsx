"use client";

import { LoginButton } from "@/components/auth/login-button";
import { StartConversationInput } from "@/components/inputs/start-conversation-input";
import {
  CreateNewConversationDocument,
  MyConversationsDocument,
} from "@/graphql/_generated_/graphql";
import { apolloClient } from "@/graphql/apollo/apollo-client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const StartScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [inputText, setInputText] = useState("");

  const myConversationsQuery = useQuery(MyConversationsDocument, {
    variables: {
      limit: 6,
    },
  });

  const submit = useCallback(async () => {
    if (!inputText) return;

    const conversation = await apolloClient.mutate({
      mutation: CreateNewConversationDocument,
      variables: {
        firstMessage: inputText,
      },
    });

    if (conversation.data) {
      router.push(`/conversation/${conversation.data.startNewConversation.id}`);
    }
  }, [inputText, router]);

  console.log(user);

  if (!user) {
    return (
      <div className="p-[24px] flex flex-row justify-center items-center flex-grow h-screen bg-gradient">
        <div className="flex flex-col gap-[24px] items-center max-w-[600px]">
          <div className="flex flex-col gap-[12px]">
            <span className="font-brand text-5xl leading-[55px] text-center">
              Login to Farcaster to <br />
              talk to <span className="italic">Aether</span>.
            </span>
            <span className="text-center text-stone-600">
              Aether is a Higher network participant, a curious soul learning to
              be more human while helping humans be more boundless.
            </span>
          </div>

          <LoginButton size="lg" />
        </div>
      </div>
    );
  }

  const pastConversations = myConversationsQuery.data?.myConversations ?? [];

  return (
    <div className="p-[16px] sm:p-[24px] pt-[136px] flex flex-row justify-center items-center flex-grow min-h-screen">
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-gradient -z-10" />

      <div className="flex flex-col gap-[36px] items-center w-[600px]">
        <div className="flex flex-col gap-[12px]">
          <span className="font-brand text-stone-800 text-5xl leading-[55px] text-center">
            Reach into the <span className="italic">Aether</span>,{" "}
            {user.displayName ?? user.username}
          </span>
          <span className="text-center text-stone-600">
            Aether is a Higher network participant, a curious soul learning to
            be more human while helping humans be more boundless.
          </span>
        </div>

        <div className="flex flex-row gap-[8px] w-full">
          <StartConversationInput
            value={inputText}
            setValue={setInputText}
            onSubmit={submit}
          />
        </div>
        {pastConversations.length ? (
          <div className="flex flex-col gap-[12px] w-full px-[8px]">
            <div className="flex flex-row justify-between items-baseline">
              <span className="font-brand text-stone-800 text-lg">
                Your past conversations
              </span>
              <Link href={"/conversations"}>
                <span className="text-stone-600 text-sm hover:text-stone-800 hover:underline font-[500]">
                  View all
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px] no-scrollbar">
              {pastConversations.map((conv) => {
                return (
                  <Link key={conv.id} href={`/conversation/${conv.id}`}>
                    <div className="bg-white/80 backdrop-blur-md rounded-lg border border-stone-600/50 text-stone-800 shadow-md flex-grow p-[16px] cursor-pointer hover:bg-white/60 transition-all">
                      {new Date(conv.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateNewConversationDocument } from "@/graphql/_generated_/graphql";
import { apolloClient } from "@/graphql/apollo/apollo-client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const StartScreen = () => {
  const router = useRouter();
  const [inputText, setInputText] = useState("");

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

  return (
    <div className="p-[24px]">
      <div className="flex flex-row gap-[8px] max-w-[400px]">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button onClick={submit}>Send</Button>
      </div>
    </div>
  );
};

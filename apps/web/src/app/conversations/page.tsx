import {
  MeDocument,
  MyConversationsDocument,
} from "@/graphql/_generated_/graphql";
import { serverApolloClient } from "@/graphql/apollo/server-component";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await serverApolloClient.query({
    query: MeDocument,
  });

  if (!me.data.me) {
    notFound();
  }

  const conversations = await serverApolloClient.query({
    query: MyConversationsDocument,
  });

  return (
    <div className="flex flex-col items-center p-[16px] sm:p-[24px] pt-[128px] sm:pt-[128px]">
      <div className="fixed top-0 left-0 bottom-0 right-0 bg-gradient -z-10" />
      <div className="pb-[48px] font-brand text-3xl text-center">
        Your past conversations
      </div>
      <div className="flex flex-col max-w-[600px] gap-[16px] flex-grow w-full">
        {conversations.data.myConversations.map((conv) => (
          <Link key={conv.id} href={`/conversation/${conv.id}`}>
            <div className="bg-white/80 backdrop-blur-md rounded-lg border w-full border-stone-600/50 text-stone-800 shadow-md flex-grow p-[16px] cursor-pointer hover:bg-white/60 transition-all">
              {new Date(conv.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

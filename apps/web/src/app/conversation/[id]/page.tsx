import {
  ConversationWithMessagesDocument,
  MeDocument,
} from "@/graphql/_generated_/graphql";
import { serverApolloClient } from "@/graphql/apollo/server-component";
import { ConversationScreen } from "@/screens/conversation";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: { id: string } }) {
  const me = await serverApolloClient.query({
    query: MeDocument,
  });

  if (!me.data.me) {
    notFound();
  }

  let conv;
  try {
    conv = await serverApolloClient.query({
      query: ConversationWithMessagesDocument,
      variables: {
        conversationId: params.id,
      },
    });
  } catch {
    notFound();
  }

  if (!conv || conv.data.getConversationWithMessages.ownerFid) {
    notFound();
  }

  return (
    <serverApolloClient.PreloadQuery
      query={ConversationWithMessagesDocument}
      variables={{ conversationId: params.id }}
    >
      <ConversationScreen conversationId={params.id} />
    </serverApolloClient.PreloadQuery>
  );
}

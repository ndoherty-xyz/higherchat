import { ConversationWithMessagesDocument } from "@/graphql/_generated_/graphql";
import { serverApolloClient } from "@/graphql/apollo/server-component";
import { ConversationScreen } from "@/screens/conversation";

export default function Home({ params }: { params: { id: string } }) {
  return (
    <serverApolloClient.PreloadQuery
      query={ConversationWithMessagesDocument}
      variables={{ conversationId: params.id }}
    >
      <ConversationScreen conversationId={params.id} />
    </serverApolloClient.PreloadQuery>
  );
}

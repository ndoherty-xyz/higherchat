import { builder } from "./builder";
import { createNewConversationBuilder } from "./endpoints/conversations/create";
import { meBuilder } from "./endpoints/users/get";

builder.queryType({
  fields: (t) => ({
    me: meBuilder(t),
  }),
});

builder.mutationType({
  fields: (t) => ({
    startNewConversation: createNewConversationBuilder(t),
  }),
});

export const schema = builder.toSchema();

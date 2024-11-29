import { builder } from "./builder";
import { createNewConversationBuilder } from "./endpoints/conversations/create";
import { getConverstationBuilder } from "./endpoints/conversations/get";
import { meBuilder } from "./endpoints/users/get";

builder.queryType({
  fields: (t) => ({
    me: meBuilder(t),
    getConversationWithMessages: getConverstationBuilder(t),
  }),
});

builder.mutationType({
  fields: (t) => ({
    startNewConversation: createNewConversationBuilder(t),
  }),
});

export const schema = builder.toSchema();

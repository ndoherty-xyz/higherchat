import { builder, QueryBuilderArg } from "./builder";
import { createNewConversationBuilder } from "./endpoints/conversations/create";

const testQuerytype = builder
  .objectRef<{ success: boolean }>("testType")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
    }),
  });

export const testTypeBuilder = (t: QueryBuilderArg) => {
  return t.field({
    type: testQuerytype,
    resolve: async (_, args, ctx) => {
      return { success: true };
    },
  });
};

builder.queryType({
  fields: (t) => ({
    test: testTypeBuilder(t),
  }),
});

builder.mutationType({
  fields: (t) => ({
    startNewConversation: createNewConversationBuilder(t),
  }),
});

export const schema = builder.toSchema();

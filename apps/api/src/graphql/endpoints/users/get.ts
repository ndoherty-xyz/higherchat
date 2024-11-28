import { User } from "@neynar/nodejs-sdk/build/api";
import { neynarClient } from "app";
import { builder, QueryBuilderArg } from "graphql/builder";
import { requireAuth } from "utils/requireAuth";

export const UserType = builder.objectRef<User>("NeynarUserType").implement({
  fields: (t) => ({
    username: t.exposeString("username"),
    avatarUrl: t.exposeString("pfp_url", { nullable: true }),
    displayName: t.exposeString("display_name", { nullable: true }),
  }),
});

export const meBuilder = (t: QueryBuilderArg) => {
  return t.field({
    type: UserType,
    resolve: async (_, args, ctx) => {
      const authUser = await requireAuth(ctx);

      const userRes = await neynarClient.fetchBulkUsers({
        fids: [authUser.fid],
      });
      const user = userRes.users[0];

      return user;
    },
  });
};

import { User } from "@neynar/nodejs-sdk/build/api";
import { neynarClient } from "app";
import { builder, QueryBuilderArg } from "graphql/builder";
import { requireAuth } from "utils/requireAuth";

export const UserType = builder.objectRef<User>("NeynarUserType").implement({
  fields: (t) => ({
    fid: t.exposeInt("fid"),
    username: t.exposeString("username"),
    avatarUrl: t.exposeString("pfp_url", { nullable: true }),
    displayName: t.exposeString("display_name", { nullable: true }),
  }),
});

export const getUser = async (fid: number): Promise<User> => {
  const userRes = await neynarClient.fetchBulkUsers({
    fids: [fid],
  });
  const user = userRes.users[0];

  if (!user) throw new Error("User not found");

  return user;
};

export const meBuilder = (t: QueryBuilderArg) => {
  return t.field({
    type: UserType,
    resolve: async (_, args, ctx) => {
      const authUser = await requireAuth(ctx);

      return await getUser(authUser.fid);
    },
  });
};

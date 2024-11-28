import { neynarClient } from "app";
import { SchemaContext } from "graphql/builder";

export const requireAuth = async (
  ctx: SchemaContext
): Promise<{ fid: number; signerUuid: string }> => {
  if (!ctx.user)
    throw new Error("[Auth Error] Graphql context has no authenticated user.");

  const signerLookup = await neynarClient.lookupSigner({
    signerUuid: ctx.user.signerUuid,
  });

  if (!signerLookup) {
    throw new Error("[Auth Error] Invalid signer");
  }

  if (signerLookup.fid !== ctx.user.fid) {
    throw new Error("[Auth Error] Invalid signer and fid combination");
  }

  return ctx.user;
};

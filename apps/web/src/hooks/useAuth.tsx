import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { apolloClient } from "@/graphql/apollo/apollo-client";
import { useQuery } from "@apollo/client";
import { MeDocument, UserFragment } from "@/graphql/_generated_/graphql";

export const useAuth = () => {
  const router = useRouter();
  const meQuery = useQuery(MeDocument);

  const login = (fid: number, signerUUID: string) => {
    setCookie("higherchat-auth", `${fid}:::${signerUUID}`, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // expires in 1 week
    });
    router.refresh();
    apolloClient.resetStore();
  };

  const logout = () => {
    deleteCookie("higherchat-auth");
    router.refresh();
    apolloClient.resetStore();
  };

  return {
    login,
    logout,
    user: meQuery.data?.me as UserFragment | undefined,
  };
};

export const useAuthServer = () => {
  const router = useRouter();
  const meQuery = useQuery(MeDocument);

  const login = (fid: number, signerUUID: string) => {
    setCookie("higherchat-auth", `${fid}:::${signerUUID}`, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // expires in 1 week
    });
    router.refresh();
    apolloClient.resetStore();
  };

  const logout = () => {
    deleteCookie("higherchat-auth");
    router.refresh();
    apolloClient.resetStore();
  };

  return {
    login,
    logout,
    user: meQuery.data?.me as UserFragment | undefined,
  };
};

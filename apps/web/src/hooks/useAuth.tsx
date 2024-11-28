import React, { useContext } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { apolloClient } from "@/graphql/apollo/apollo-client";

type AuthUser = {
  signerUUID: string;
  fid: number;
};

type AuthContextValue = {
  login: ((fid: number, signerUUID: string) => void) | undefined;
  logout: (() => void) | undefined;
  state: AuthUser | undefined;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context.login || !context.logout) {
    throw new Error(
      "AuthContext helper functions are missing! Is there something wrong with how you're using useAuth?"
    );
  }

  return {
    login: context.login,
    logout: context.logout,
    state: context.state,
  };
};

export const AuthContext = React.createContext<AuthContextValue>({
  state: undefined,
  login: undefined,
  logout: undefined,
});

export const AuthProvider = (props: React.PropsWithChildren) => {
  const router = useRouter();
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

  const fidSignerString = getCookie("higherchat-auth");
  let user = undefined;
  if (fidSignerString) {
    const [fid, signerUuid] = fidSignerString.split(":::");
    user = {
      fid: Number(fid),
      signerUUID: signerUuid as string,
    };
  }

  return (
    <AuthContext.Provider value={{ state: user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

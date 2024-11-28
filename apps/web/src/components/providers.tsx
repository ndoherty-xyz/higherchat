"use client";

import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";
import { AuthProvider } from "@/hooks/useAuth";

// Create a client
export const Providers = (props: React.PropsWithChildren) => {
  return (
    <NeynarContextProvider
      settings={{
        clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
        defaultTheme: Theme.Light,
        eventsCallbacks: {
          onAuthSuccess: () => {},
          onSignout() {},
        },
      }}
    >
      <AuthProvider>{props.children}</AuthProvider>
    </NeynarContextProvider>
  );
};

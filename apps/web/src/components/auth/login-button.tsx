"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { useQuery } from "@apollo/client";
import { MeDocument } from "@/graphql/_generated_/graphql";
import { Avatar } from "../users/avatar";

let authWindow: WindowProxy | null;
const authUrl = new URL("https://app.neynar.com/login");
const authOrigin = authUrl.origin;

export const LoginButton = () => {
  const auth = useAuth();

  const meQuery = useQuery(MeDocument);

  const handleMessage = useCallback(
    (
      event: MessageEvent<{
        is_authenticated: boolean;
        signer_uuid: string;
        fid: number;
      }>
    ) => {
      if (event.origin === authOrigin && event.data.is_authenticated) {
        auth.login(event.data.fid, event.data.signer_uuid);

        if (authWindow) {
          authWindow.close();
        }

        window.removeEventListener("message", handleMessage);
      }
    },
    []
  );

  const handleSignIn = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
    if (!clientId) throw new Error("NO NEYNAR CLIENT ID");

    authUrl.searchParams.append("client_id", clientId);

    const isDesktop = window.matchMedia("(min-width: 800px)").matches;

    const width = 600,
      height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // Define window features for the popup
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;

    const windowOptions = isDesktop ? windowFeatures : "fullscreen=yes";

    authWindow = window.open(authUrl.toString(), "_blank", windowOptions);
    window.addEventListener("message", handleMessage, false);
  }, []);

  return (
    <>
      {auth.state ? (
        <div className="flex flex-row gap-2 items-center">
          {meQuery.data?.me ? (
            <Avatar
              pfpUrl={meQuery.data.me.avatarUrl}
              size="md"
              overrideSize={36}
            />
          ) : null}
          <Button onClick={() => auth.logout()}>Logout</Button>
        </div>
      ) : (
        <Button onClick={() => handleSignIn()}>Login</Button>
      )}
    </>
  );
};

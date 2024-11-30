"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { Avatar } from "../users/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

let authWindow: WindowProxy | null;
const authUrl = new URL("https://app.neynar.com/login");
const authOrigin = authUrl.origin;

export const LoginButton = (props: { size?: "sm" | "lg" }) => {
  const auth = useAuth();

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
      {auth.user ? (
        <div className="flex flex-row gap-2 items-center">
          <Popover>
            <PopoverTrigger>
              <Avatar
                pfpUrl={auth.user.avatarUrl}
                size="lg"
                overrideSize={36}
              />
            </PopoverTrigger>
            <PopoverContent
              sideOffset={8}
              align="end"
              className="flex flex-col  bg-white/80 backdrop-blur-md rounded-xl border border-stone-600/50 shadow-md p-0  w-[150px]"
            >
              <div className="flex flex-col items-center gap-[8px] border-b border-stone-600/50 pb-[12px] pt-[16px]">
                <Avatar
                  pfpUrl={auth.user.avatarUrl}
                  size="lg"
                  overrideSize={36}
                />
                <span className="text-stone-800 font-[500]">
                  @{auth.user.username}
                </span>
              </div>

              <div className="p-[8px]">
                <div className=" flex flex-row rounded-md hover:bg-red-400/10 group px-[12px] py-[8px] cursor-pointer ">
                  <span
                    className="text-red-600 text-center w-full flex-grow"
                    onClick={auth.logout}
                  >
                    Log out
                  </span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Button size={props.size ?? "default"} onClick={() => handleSignIn()}>
          Login
        </Button>
      )}
    </>
  );
};

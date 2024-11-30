import { serverApolloClient } from "@/graphql/apollo/server-component";
import { LoginButton } from "./auth/login-button";
import { HigherLogo } from "./ui/icons/higher-logo";
import { MeDocument } from "@/graphql/_generated_/graphql";
import Link from "next/link";

export const Navbar = () => {
  return (
    <serverApolloClient.PreloadQuery query={MeDocument}>
      <>
        <div className="fixed top-0 left-0 w-screen flex flex-row justify-between py-[16px] px-[24px] items-center">
          <Link href="/">
            <span className="text-stone-800 group">
              <HigherLogo
                size={24}
                color="currentColor"
                className="group-hover:scale-110 transition-all"
              />
            </span>
          </Link>

          <LoginButton />
        </div>
      </>
    </serverApolloClient.PreloadQuery>
  );
};

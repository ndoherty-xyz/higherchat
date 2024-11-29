import { serverApolloClient } from "@/graphql/apollo/server-component";
import { LoginButton } from "./auth/login-button";
import { HigherLogo } from "./ui/icons/higher-logo";
import { MeDocument } from "@/graphql/_generated_/graphql";

export const Navbar = () => {
  return (
    <serverApolloClient.PreloadQuery query={MeDocument}>
      <div className="flex flex-row justify-between py-[16px] px-[24px] items-center border-b border-l-stone-200">
        <HigherLogo size={24} color="currentColor" />
        <LoginButton />
      </div>
    </serverApolloClient.PreloadQuery>
  );
};

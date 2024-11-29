import { Avatar } from "@/components/users/avatar";
import { ConversationMessageFragment } from "@/graphql/_generated_/graphql";

export const ConversationMessage = (props: {
  message: ConversationMessageFragment;
}) => {
  return (
    <div className="flex flex-row gap-[12px] items-start p-[12px] bg-background rounded-xl border border-stone-200">
      <Avatar
        pfpUrl={props.message.user.avatarUrl}
        size="md"
        overrideSize={23}
      />
      <span className="font-brand font-[300] text-[16px] leading-[28px]">
        {props.message.messageText}
      </span>
    </div>
  );
};

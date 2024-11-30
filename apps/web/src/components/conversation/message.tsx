import { Avatar } from "@/components/users/avatar";
import { ConversationMessageFragment } from "@/graphql/_generated_/graphql";

export const ConversationMessage = (props: {
  message: ConversationMessageFragment;
}) => {
  return (
    <div className="flex flex-col gap-[16px] items-start p-[16px] bg-white/80 backdrop-blur-md rounded-2xl border border-stone-600/50 shadow-md">
      <div className="flex flex-row gap-[4px] items-center">
        <Avatar
          pfpUrl={props.message.user.avatarUrl}
          size="md"
          overrideSize={18}
        />
        <span className="font-[500] text-stone-600 text-[14px]">
          {props.message.user.username} on{" "}
          {new Date(props.message.timestamp).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
      </div>

      <p className="w-full font-[500] text-stone-800 text-[16px] break-words">
        {props.message.messageText}
      </p>
    </div>
  );
};

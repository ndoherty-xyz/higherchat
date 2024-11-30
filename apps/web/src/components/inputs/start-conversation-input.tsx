import { Button } from "../ui/button";
import { HigherLogo } from "../ui/icons/higher-logo";
import { Textarea } from "../ui/textarea";

type StartConversationInputProps = {
  value: string;
  setValue: (val: string) => void;
  onSubmit: () => void;
};

export const StartConversationInput = (props: StartConversationInputProps) => {
  return (
    <>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-stone-600/50 shadow-md flex-grow flex flex-row gap-[8px]">
        <Textarea
          rows={6}
          onEnter={props.onSubmit}
          placeholder="Start a conversation..."
          containerClassName="flex-grow"
          className="text-black w-full h-fit max-h-[300px] text-[16px] rounded-none bg-transparent p-[16px] resize-none"
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
        />
        {props.value ? (
          <Button
            onClick={props.onSubmit}
            className="w-[32px] h-[32px] bg-[#018A08] hover:bg-[#018A08] outline outline-2 -outline-offset-1 outline-transparent hover:outline-[#018A08] transition-all text-white mt-[16px] mr-[16px]"
          >
            <HigherLogo size={16} color="currentColor" />
          </Button>
        ) : null}
      </div>
    </>
  );
};

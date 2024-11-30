import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: boolean | undefined;
  onEnter?: () => void;
  containerClassName?: string;
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative", props.containerClassName)}>
        <textarea
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.onEnter?.();
            }
          }}
          className={cn(
            `no-scrollbar flex leading-[20px] min-h-[100px] text-[16px] text-black font-[500] p-[12px] rounded-lg bg-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-stone-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            props.error ? "text-red border-red hover:border-red" : "",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

import { cn } from "@/lib/utils";
import type { FC } from "react";

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Footer: FC<FooterProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-neutral-700 text-neutral-100 p-4 flex flex-row justify-end items-center relative bottom-0 left-0 w-full",
        className
      )}
      {...props}
    >
      <p>© 2025 VO Olivier</p>
    </div>
  );
};

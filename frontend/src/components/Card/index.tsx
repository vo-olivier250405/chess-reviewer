import { cn } from "@/lib/utils";
import type React from "react";
import type { FC } from "react";
import { ChevronRight } from "lucide-react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children?: React.ReactNode;
  withHoverEffect?: boolean;
}

export const Card: FC<CardProps> = ({
  className,
  title,
  children,
  withHoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-md border border-slate-400 p-4 overflow-hidden z-0",
        "transition-colors",
        className
      )}
      {...props}
    >
      {withHoverEffect && (
        <div
          className="
          absolute top-0 left-0 h-full 
          bg-neutral-700
          flex items-center pl-3
          w-5/6
          -translate-x-full
          transition-transform duration-500 ease-in-out
          group-hover:translate-x-0
        "
        >
          <ChevronRight className="text-white transition-transform duration-500 group-hover:translate-x-2" />
        </div>
      )}

      <div
        className={cn(
          "relative flex flex-col gap-3",
          withHoverEffect
            ? "transition-transform duration-500 ease-in-out group-hover:translate-x-14"
            : ""
        )}
      >
        <p className="text-primary-300 font-bold text-xl">{title}</p>
        {children}
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { Link, type LinkComponentProps } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import type { FC } from "react";

export const NotificationsLink: FC<LinkComponentProps> = (
  { className },
  ...props
) => {
  return (
    <Link
      to="/notifications"
      className={cn(
        "p-4 rounded-md hover:bg-slate-900 transition-all ease-in-out",
        className
      )}
      {...props}
    >
      <Bell className="size-5 text-slate-400" />
    </Link>
  );
};

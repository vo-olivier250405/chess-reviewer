import { cn } from "@/lib/utils";
import type { FC } from "react";

interface MainProps extends React.HTMLAttributes<HTMLElement> {}

const Main: FC<MainProps> = ({ className, ...props }) => (
  <main
    {...props}
    className={cn("h-screen w-full text-slate-100 bg-slate-200", className)}
  />
);

export default Main;

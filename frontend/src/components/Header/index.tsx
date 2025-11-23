import { cn } from "@/lib/utils";
import useAuth from "@/stores/useAuth";
import { Link } from "@tanstack/react-router";
import type { FC, HTMLAttributes } from "react";

interface HeaderProps extends HTMLAttributes<HTMLHeadElement> {}

const Header: FC<HeaderProps> = ({ className }, ...props) => {
  const user = useAuth((state) => state.user);

  return (
    <header
      className={cn(
        "bg-slate-800 text-slate-200 p-8 flex flex-row justify-between",
        className
      )}
      {...props}
    >
      <Link to="/">The Chess Review</Link>
      <div className="flex flex-row gap-2">
        {user ? <p>{user.username}</p> : <Link to="/login">Login</Link>}
      </div>
    </header>
  );
};

export default Header;

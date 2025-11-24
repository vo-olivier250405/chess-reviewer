import { cn } from "@/lib/utils";
import useAuth from "@/stores/useAuth";
import { Link } from "@tanstack/react-router";
import type { FC, HTMLAttributes } from "react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { getLogoutMutation } from "@/hooks/mutations/logoutMutation";
import { toast } from "sonner";
import { Crown, LogOut } from "lucide-react";
import { Route } from "@/routes/__root";
import { NotificationsLink } from "../Links/NotificationsLink";

interface HeaderProps extends HTMLAttributes<HTMLHeadElement> {}

const Header: FC<HeaderProps> = ({ className }, ...props) => {
  const { user, clearAuth } = useAuth();
  const navigation = Route.useNavigate();

  const logoutMutation = useMutation({
    ...getLogoutMutation(user?.username || ""),
    onSuccess: () => {
      toast.success("Logged out successfully");
      clearAuth();
      navigation({ to: "/" });
    },
    onError: () => {
      toast.error("Failed to log out");
    },
  });

  return (
    <header
      className={cn(
        "bg-slate-800 text-slate-200 p-8 flex flex-row justify-between items-center",
        className
      )}
      {...props}
    >
      <Link to="/">The Chess Review</Link>
      <div className="flex flex-row gap-2">
        {user ? (
          <div className="flex flex-row gap-2">
            <Link
              to="/games"
              className="p-4 rounded-md hover:bg-slate-900 transition-all ease-in-out"
            >
              <Crown className="size-5 text-green-400" />
            </Link>
            <NotificationsLink />
            <DropdownMenu>
              <DropdownMenuTrigger className="p-4 rounded-md hover:bg-slate-900 transition-all ease-in-out">
                {user.username}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Button
                  onClick={() => logoutMutation.mutate(user?.username)}
                  className="w-full flex flex-row gap-2 justify-start"
                  variant="destructive"
                >
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/stores/useAuth";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getLoginMutation } from "@/hooks/mutations/loginMutation";
import { useState, type FC } from "react";
import { toast } from "sonner";
import Main from "@/components/Main";

export const Route = createFileRoute("/login/")({
  component: () => <Login />,
});

const Login: FC = () => {
  const { setAuth, setToken } = useAuth();
  const navigate = Route.useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    ...getLoginMutation(username, password),
    onSuccess: (response) => {
      toast.success("Login successful");

      const { user, token, expiry } = response.data;
      setAuth(token, expiry, user);
      setToken(token, expiry);

      navigate({ to: "/" });
    },
    onError: (error) => {
      return toast.error(error.message || "Login failed");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <Main className="bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-between w-1/3 p-4 mx-auto mt-20 gap-4 border border-slate-300 rounded bg-white text-slate-800"
      >
        <div className="flex flex-col gap-2">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <Button type="submit" className="mt-4">
          Login
        </Button>

        <p className="text-slate-800 flex flex-col items-center">
          Doesn't have an account?
          <Link to="/register" className="text-slate-500">
            Register
          </Link>
        </p>
      </form>
    </Main>
  );
};

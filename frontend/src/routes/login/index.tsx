import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/stores/useAuth";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getLoginMutation } from "@/lib/options/mutations/loginMutation";
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
    <Main>
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-between w-1/2 p-10 mx-auto mt-20 gap-4 rounded bg-neutral-700 text-neutral-100"
      >
        <div className="flex flex-col gap-2">
          <Input
            className="bg-neutral-100 py-6 text-neutral-900"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <Input
            className="bg-neutral-100 py-6 text-neutral-900"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        <div className="flex flex-row gap-2 items-center justify-between">
          <Button type="submit" className="w-fit">
            Login
          </Button>

          <p className="text-neutral-100 flex flex-row items-center">
            Doesn't have an account?
            <Link to="/register" className="ml-2 text-primary-200">
              Register
            </Link>
          </p>
        </div>
      </form>
    </Main>
  );
};

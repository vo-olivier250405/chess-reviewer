import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRegisterMutation } from "@/lib/options/mutations/registerMutation";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/register/")({
  component: () => <Register />,
});

const Register: FC = () => {
  const navigate = Route.useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    ...getRegisterMutation(username, password),
    onSuccess: () => {
      toast.success("Registration successful");
      navigate({ to: "/login" });
    },
    onError: (error) => {
      return toast.error(error.message || "Registration failed");
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    mutation.mutate({ username, password });
  };

  return (
    <Main>
      <form
        onSubmit={handleRegister}
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
          <Input
            className="bg-neutral-100 py-6 text-neutral-900"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </div>

        <div className="flex flex-row gap-2 items-center justify-between">
          <Button type="submit" className="w-fit">
            Register
          </Button>

          <p className="text-neutral-100 flex flex-row items-center">
            Already have an account?
            <Link to="/login" className="ml-2 text-primary-200">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </Main>
  );
};

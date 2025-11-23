import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRegisterMutation } from "@/hooks/mutations/registerMutation";
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
    <form
      onSubmit={handleRegister}
      className="flex flex-col justify-between w-1/3 p-4 mx-auto mt-20 gap-4 border border-slate-300 rounded"
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
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />
      </div>

      <Button type="submit" className="mt-4">
        Register
      </Button>

      <p className="text-slate-800 flex flex-col items-center">
        Already have an account?
        <Link to="/login" className="text-slate-500">
          Log in
        </Link>
      </p>
    </form>
  );
};

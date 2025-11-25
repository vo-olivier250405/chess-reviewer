import Main from "@/components/Main";
import useAuth from "@/stores/useAuth";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user } = useAuth();
  return (
    <Main>
      {user ? (
        <p className="text-4xl text-slate-200 p-4 font-bold w-full text-center py-8">
          Welcome, {user.username} !
        </p>
      ) : null}
    </Main>
  );
}

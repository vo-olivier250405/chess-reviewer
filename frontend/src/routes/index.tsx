import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAnalyzeGameMutation,
  getSendGameMutation,
} from "@/lib/options/mutations/sendGame";
import { cn } from "@/lib/utils";
import useAuth from "@/stores/useAuth";
import type { AnalyzedGame } from "@/types/Game";
import { useMutation } from "@tanstack/react-query";

import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [pgn, setPgn] = useState("");
  const navigate = Route.useNavigate();

  const analyzeMutation = useMutation({
    ...getAnalyzeGameMutation(pgn),
    onSuccess: (data) => {
      const analyzedGame = data.analyzedPositions as AnalyzedGame;

      navigate({
        to: "/games/analysis",
        state: { data: analyzedGame } as {},
      });
      setPgn("");
      setName("");
    },
    onError: (error) => toast.error(error.message),
  });

  const sendGameMutation = useMutation({
    ...getSendGameMutation(pgn, name),
    onSuccess: () => {
      toast.success(
        "Game is sent for analysis! You will be notified when it's done."
      );
      setPgn("");
      setName("");
    },
    onError: (error) => toast.error(error.message),
  });

  const mutationToUse = user ? sendGameMutation : analyzeMutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgn.trim()) return toast.error("Please enter a PGN.");
    if (!name.trim() && user) return toast.error("Please enter a game name.");

    mutationToUse.mutate();
  };

  return (
    <Main className="flex flex-col justify-center items-center size-full">
      <span className="text-4xl text-neutral-100 p-4 font-bold w-full text-center py-8">
        {user ? (
          <span className="flex flex-row items-center justify-center gap-2">
            Welcome back,
            <p className="text-primary-500">{user.username}</p>!
          </span>
        ) : (
          <span className="flex flex-row items-center justify-center gap-2">
            Welcome to
            <p className="text-primary-500">Chess Reviewer</p>!
          </span>
        )}
      </span>
      <p
        className={cn(
          "font-bold mt-2 mb-4 text-primary-100 text-center text-xl",
          mutationToUse.isPending && "animate-pulse"
        )}
      >
        {mutationToUse.isPending
          ? "Processing your game, please wait..."
          : " You can paste your PGN below to analyze your game."}
      </p>
      {mutationToUse.isPending ? (
        <Loader className="animate-spin size-7" />
      ) : (
        <form className="flex flex-col gap-4 p-4 w-1/2" onSubmit={handleSubmit}>
          {user && (
            <Input
              className="bg-neutral-100 text-neutral-900"
              placeholder="Enter the game name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <textarea
            className="flex-1 p-4 rounded-md bg-primary-300 text-neutral-700 min-h-[200px] md:min-h-[400px] placeholder:text-neutral-700/25"
            placeholder="Paste your PGN here..."
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
          />

          <div className="flex flex-col gap-4 w-fit">
            <Button
              className="bg-primary-700 hover:bg-primary-500 text-neutral-100 hover:text-neutral-700 transition-all ease-in-out"
              disabled={mutationToUse.isPending || !pgn.trim()}
              type="submit"
            >
              {mutationToUse.isPending ? "Analyzing..." : "Analyze Game"}
            </Button>
          </div>
        </form>
      )}
    </Main>
  );
}

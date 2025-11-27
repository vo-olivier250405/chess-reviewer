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
    },
    onError: (error) => toast.error(error.message),
  });

  const sendGameMutation = useMutation({
    ...getSendGameMutation(pgn, name),
    onSuccess: () =>
      toast.success(
        "Game is sent for analysis! You will be notified when it's done."
      ),
    onError: (error) => toast.error(error.message),
  });

  const mutationToUse = user ? sendGameMutation : analyzeMutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgn.trim()) return toast.error("Please enter a PGN.");
    if (!name.trim() && user) return toast.error("Please enter a game name.");

    mutationToUse.mutate();
    setName("");
    setPgn("");
  };

  return (
    <Main className="flex flex-col justify-center items-center size-full">
      <p className="text-4xl text-slate-200 p-4 font-bold w-full text-center py-8">
        {user ? `Welcome, ${user.username} !` : "Welcome to Chess Reviewer!"}
      </p>
      <p
        className={cn(
          "font-bold my-4 text-green-300 text-center",
          mutationToUse.isPending && "animate-pulse"
        )}
      >
        {mutationToUse.isPending && !user
          ? "Processing your game, please wait..."
          : " You can paste your PGN below to analyze your game."}
      </p>
      {mutationToUse.isPending && !user ? (
        <Loader className="animate-spin size-7" />
      ) : (
        <form className="flex flex-col gap-4 p-4 w-1/2" onSubmit={handleSubmit}>
          {user && (
            <Input
              placeholder="Enter the game name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <textarea
            className="flex-1 p-4 rounded-md bg-slate-700 text-slate-100 min-h-[200px] md:min-h-[400px]"
            placeholder="Paste your PGN here..."
            value={pgn}
            onChange={(e) => setPgn(e.target.value)}
          />

          <div className="flex flex-col gap-4 w-fit">
            <Button
              className="bg-green-500 hover:bg-green-300 text-slate-900 hover:text-slate-700 transition-all ease-in-out"
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

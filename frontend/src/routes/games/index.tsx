import { Card } from "@/components/Card";
import Main from "@/components/Main";
import { Skeleton } from "@/components/ui/skeleton";
import { getListGameQueryOptions } from "@/lib/options/queries/listGames";
import useAuth from "@/stores/useAuth";
import type { AnalyzedGame } from "@/types/Game";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/games/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const query = useQuery(getListGameQueryOptions(user!));

  return (
    <Main>
      {query.isError ? (
        <p className="text-destructive">
          {query.error?.message || "Error loading games."}
        </p>
      ) : query.isLoading ? (
        <div className="md:grid md:grid-cols-3">
          {Array(9)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="m-4 h-20 p-4 bg-slate-400">
                <Skeleton className="h-6 w-1/3 mb-2 bg-slate-500" />
                <Skeleton className="h-4 w-full bg-slate-500" />
              </Skeleton>
            ))}
        </div>
      ) : !!query.data ? (
        <div className="md:grid md:grid-cols-3">
          {query.data.map((game: AnalyzedGame) => (
            <Link
              to="/games/$detail"
              params={{ detail: game.id }}
              key={game.id}
            >
              <Card
                withHoverEffect
                title={game.name}
                className="m-4 bg-slate-700/60 hover:bg-slate-700 transition-all ease-in-out"
              >
                <span className="text-red-400 flex flex-row gap-2 items-center">
                  Black Accuracy:
                  <p className="font-bold text-md">
                    {Math.floor(game.accuracies.black)}%
                  </p>
                </span>
                <span className="text-green-400 flex flex-row gap-2 items-center">
                  White Accuracy:
                  <p className="font-bold text-md">
                    {Math.floor(game.accuracies.white)}%
                  </p>
                </span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>No games found.</p>
      )}
    </Main>
  );
}

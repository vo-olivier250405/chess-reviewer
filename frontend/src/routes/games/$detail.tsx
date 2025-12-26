import { createFileRoute, Link } from "@tanstack/react-router";
import Main from "@/components/Main";
import { useQuery } from "@tanstack/react-query";
import { getDetailGameOptions } from "@/lib/options/queries/detailGame";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { DisplayAnalysis } from "@/components/DisplayAnalysis";
import { Visualizer } from "@/components/Visualizer";
import { useState } from "react";
import { FIRST_POSITION_FEN } from "@/constants";

export const Route = createFileRoute("/games/$detail")({
  component: RouteComponent,
});

function RouteComponent() {
  const { detail: id } = Route.useParams();
  const query = useQuery(getDetailGameOptions(id));
  const [currentPositionIdx, setCurrentPositionIdx] = useState(0);

  return (
    <Main className="flex md:flex-row flex-col gap-4">
      <Link
        to="/games"
        className="ml-4 mb-4 bg-neutral-700 hover:bg-neutral-600 h-fit w-fit p-2 rounded-md flex items-center gap-2 text-neutral-100 transition-all"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <div className="md:w-1/2 w-full">
        {query.data && (
          <Visualizer
            fen={
              query.data.positions[currentPositionIdx]?.fen ||
              FIRST_POSITION_FEN
            }
            className="h-[calc(100vh-16.2rem)] m-4"
          />
        )}
      </div>

      {query.isLoading ? (
        <Skeleton className="m-4 h-[calc(100vh-16.2rem)] flex-1 bg-neutral-700/50" />
      ) : query.isError ? (
        <p className="text-destructive">
          {query.error?.message || "Error loading game details."}
        </p>
      ) : query.data ? (
        <DisplayAnalysis
          className="flex-1 m-4 h-[calc(100vh-10rem)]"
          data={query.data}
          onPositionChange={setCurrentPositionIdx}
        />
      ) : null}
    </Main>
  );
}

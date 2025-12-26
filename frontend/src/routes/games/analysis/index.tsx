import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import Main from "@/components/Main";
import { DisplayAnalysis } from "@/components/DisplayAnalysis";
import type { AnalyzedGame } from "@/types/Game";
import { ChevronLeft } from "lucide-react";
import { Visualizer } from "@/components/Visualizer";
import { useState } from "react";
import { FIRST_POSITION_FEN } from "@/constants";

export const Route = createFileRoute("/games/analysis/")({
  component: RouteComponent,
});

function RouteComponent() {
  const state = useRouterState({ select: (s) => s.location.state }) as {
    data?: AnalyzedGame;
  };
  const { data } = state;
  const [currentPositionIdx, setCurrentPositionIdx] = useState(0);

  return (
    <Main className="flex md:flex-row flex-col gap-4">
      <Link
        to="/"
        className="ml-4 mb-4 bg-neutral-700 hover:bg-neutral-600 h-fit w-fit p-2 rounded-md flex items-center gap-2 text-neutral-100 transition-all"
      >
        <ChevronLeft className="size-5" />
      </Link>
      {data && (
        <>
          <div className="md:w-1/2 w-full">
            <Visualizer
              fen={
                data.positions[currentPositionIdx]?.fen || FIRST_POSITION_FEN
              }
              className="h-[calc(100vh-16.2rem)] m-4"
            />
          </div>

          <DisplayAnalysis
            className="flex-1 m-4 h-[calc(100vh-10rem)]"
            data={data}
            onPositionChange={setCurrentPositionIdx}
          />
        </>
      )}
    </Main>
  );
}

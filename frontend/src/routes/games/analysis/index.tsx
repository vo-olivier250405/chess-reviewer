import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import Main from "@/components/Main";
import { DisplayAnalysis } from "@/components/DisplayAnalysis";
import type { AnalyzedGame } from "@/types/Game";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Construction } from "lucide-react";

export const Route = createFileRoute("/games/analysis/")({
  component: RouteComponent,
});

function RouteComponent() {
  const state = useRouterState({ select: (s) => s.location.state }) as {
    data?: AnalyzedGame;
  };
  const { data } = state;
  return (
    <Main className="flex md:flex-row flex-col gap-4">
      <Link to="/" className="-mt-4 ml-4 bg-slate-700 h-fit p-2 rounded-md">
        <ChevronLeft />
      </Link>
      {data && (
        <>
          <div className="md:w-1/2 w-full">
            <Skeleton className="h-[calc(100vh-16.2rem)] bg-orange-200 text-orange-400 items-center text-center flex flex-col gap-4 justify-center m-4">
              <Construction className="size-24" />
              <p className="font-bold text-3xl">IN PROGRESS</p>
            </Skeleton>
          </div>

          <DisplayAnalysis
            className="flex-1 m-4 h-[calc(100vh-10rem)]"
            data={data}
          />
        </>
      )}
    </Main>
  );
}

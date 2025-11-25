import { createFileRoute } from "@tanstack/react-router";
import Main from "@/components/Main";
import { useQuery } from "@tanstack/react-query";
import { getDetailGameOptions } from "@/lib/options/queries/detailGame";
import { Skeleton } from "@/components/ui/skeleton";
import { Construction } from "lucide-react";
import { DisplayAnalysis } from "@/components/DisplayAnalysis";

export const Route = createFileRoute("/games/$detail")({
  component: RouteComponent,
});

function RouteComponent() {
  const { detail: id } = Route.useParams();
  const query = useQuery(getDetailGameOptions(id));

  return (
    <Main className="flex flex-row gap-4 min-h-screen">
      <Skeleton className="flex-1 bg-orange-200 text-orange-400 items-center text-center flex flex-col gap-4 justify-center m-4">
        <Construction className="size-24" />
        <p className="font-bold text-3xl">IN PROGRESS</p>
      </Skeleton>

      {query.isLoading ? (
        <Skeleton className="flex-1 m-4" />
      ) : query.isError ? (
        <p className="text-destructive">
          {query.error?.message || "Error loading game details."}
        </p>
      ) : query.data ? (
        <DisplayAnalysis className="flex-1 m-4" data={query.data} />
      ) : null}
    </Main>
  );
}

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
    <Main className="flex md:flex-row flex-col gap-4">
      <div className="md:w-1/2 w-full">
        <Skeleton className="h-[calc(100vh-16.2rem)] bg-orange-200 text-orange-400 items-center text-center flex flex-col gap-4 justify-center m-4">
          <Construction className="size-24" />
          <p className="font-bold text-3xl">IN PROGRESS</p>
        </Skeleton>
      </div>

      {query.isLoading ? (
        <Skeleton className="m-4 h-[calc(100vh-16.2rem)] flex-1" />
      ) : query.isError ? (
        <p className="text-destructive">
          {query.error?.message || "Error loading game details."}
        </p>
      ) : query.data ? (
        <DisplayAnalysis
          className="flex-1 m-4 h-[calc(100vh-10rem)]"
          data={query.data}
        />
      ) : null}
    </Main>
  );
}

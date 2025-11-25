import { createFileRoute } from "@tanstack/react-router";
import Main from "@/components/Main";
import { useQuery } from "@tanstack/react-query";
import { getDetailGameOptions } from "@/lib/options/queries/detailGame";

export const Route = createFileRoute("/games/$detail")({
  component: RouteComponent,
});

function RouteComponent() {
  const { detail: id } = Route.useParams();
  const query = useQuery(getDetailGameOptions(id));

  return (
    <Main>
      <div className="text-red-400">Game ID: {id}</div>
    </Main>
  );
}

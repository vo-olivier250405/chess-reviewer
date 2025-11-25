import Main from "@/components/Main";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Main>Hello "/notifications/"!</Main>;
}

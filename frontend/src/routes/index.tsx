import Main from "@/components/Main";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <Main>{/* <Header /> */}</Main>;
}

import Piece from "@/components/Piece";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <Piece piece={{ color: "b", piece: "k" }} />
    </div>
  );
}

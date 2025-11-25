import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/$detail')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/$detail"!</div>
}

import { Card } from "@/components/Card";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { Notification } from "@/types/Notification";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => api.get<Notification[]>("/notifications/"),
    select: (res) =>
      "data" in res.data ? (res.data.data as Notification[]) : [],
  });

  return (
    <Main>
      <Link to="/" className="ml-4 mb-4 bg-neutral-700 hover:bg-neutral-600 h-fit w-fit p-2 rounded-md flex items-center gap-2 text-neutral-100 transition-all">
        <ChevronLeft className="size-5" />
      </Link>
      {query.isLoading ? (
        <div className="md:grid md:grid-cols-1">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="m-4 h-20 p-4 bg-slate-400">
                <Skeleton className="h-6 w-1/3 mb-2 bg-slate-500" />
                <Skeleton className="h-4 w-full bg-slate-500" />
              </Skeleton>
            ))}
        </div>
      ) : query.isError ? (
        <p className="text-destructive">
          {query.error?.message || "Error loading notifications."}
        </p>
      ) : query.data?.length === 0 ? null : (
        <div className="flex flex-col gap-4 m-4">
          {query.data?.map((notification) => (
            <Card
              key={notification.id}
              className="border rounded-xl transition-all"
              title={notification.title}
            >
              <div className="flex flex-col gap-2">
                {notification.object_type && (
                  <p className="w-fit capitalize border rounded-full px-2 text-sm">
                    {notification.object_type}
                  </p>
                )}

                <p className="text-slate-300">{notification.message}</p>

                {notification.redirection?.url && (
                  <Link to={notification.redirection.url} className="w-fit">
                    <Button className="mt-2 w-fit">
                      {notification.redirection.label ?? "Go to details"}
                    </Button>
                  </Link>
                )}

                <span className="text-xs text-slate-200 mt-2">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Main>
  );
}

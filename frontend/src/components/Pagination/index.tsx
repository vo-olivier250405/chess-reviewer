import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/PaginatedResponse";
import type { UseQueryResult } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HTMLAttributes } from "react";

interface PaginationProps<T> extends HTMLAttributes<HTMLDivElement> {
  query: UseQueryResult<PaginatedResponse<T>, unknown>;
  onPageChange: (page: number) => void;
}

export const Pagination = <T,>({
  query,
  onPageChange,
  className,
  ...props
}: PaginationProps<T>) => {
  const data = query.data;

  if (!data || !data.pager) {
    return null;
  }

  const { current, total } = data.pager;
  const hasNext = data.next !== null;
  const hasPrevious = data.previous !== null;

  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(current - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(current + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push("...");
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push("...");
      }

      pages.push(total);
    }

    return pages;
  };

  return (
    <div
      {...props}
      className={cn(
        "flex items-center justify-center gap-2 py-4 bg-slate-700 m-4 rounded-full p-3",
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={!hasPrevious || query.isLoading}
        className="text-slate-400 bg-transparent hover:bg-slate-800 hover:text-slate-100 border-0"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={current === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page as number)}
              disabled={query.isLoading}
              className={cn(
                "text-slate-400 bg-transparent hover:bg-slate-800 hover:text-slate-100 border-0",
                current === page &&
                  "bg-slate-900 text-primary-foreground border"
              )}
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={!hasNext || query.isLoading}
        className="text-slate-400 bg-transparent hover:bg-slate-800 hover:text-slate-100 border-0"
      >
        <ChevronRight className="size-5 text-slate-400 bg-transparent" />
      </Button>

      <span className="ml-4 text-sm text-gray-500">
        Page {current} of {total}
      </span>
    </div>
  );
};

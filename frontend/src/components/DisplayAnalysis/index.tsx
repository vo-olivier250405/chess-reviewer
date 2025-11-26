import { cn } from "@/lib/utils";
import type { AnalyzedGame } from "@/types/Game";
import type { Classification } from "@/types/Classification";
import type React from "react";
import { useState, type FC } from "react";
import { Card } from "../Card";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface DisplayAnalysisProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: AnalyzedGame;
}

export const DisplayAnalysis: FC<DisplayAnalysisProps> = ({
  data,
  className,
  ...props
}) => {
  const { positions, accuracies, classifications } = data;
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentPosition = positions[currentIdx];

  const totalAccuracy = accuracies.white + accuracies.black;
  const whitePercent = totalAccuracy
    ? (accuracies.white / totalAccuracy) * 100
    : 50;
  const blackPercent = totalAccuracy
    ? (accuracies.black / totalAccuracy) * 100
    : 50;

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card title="Accuracy Comparison" className="w-full p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-50 font-semibold">
              White: {Math.floor(accuracies.white)}%
            </span>
            <span className="text-slate-900 font-semibold">
              Black: {Math.floor(accuracies.black)}%
            </span>
          </div>
          <div className="relative w-full h-4 bg-slate-600 rounded-md overflow-hidden">
            <div
              className="absolute left-0 top-0 h-4 bg-slate-50 transition-all duration-500"
              style={{ width: `${whitePercent}%` }}
            />
            <div
              className="absolute right-0 top-0 h-4 bg-slate-900 transition-all duration-500"
              style={{ width: `${blackPercent}%` }}
            />
          </div>
        </div>
      </Card>

      <Card
        title={`${currentPosition.move.san} - ${currentIdx === 0 ? "First move" : currentPosition.classification}`}
      >
        <p className="text-gray-200 mb-2">Top moves:</p>
        <div className="flex flex-row gap-3 flex-wrap">
          {currentPosition.topLines?.map((line, idx) => (
            <span
              key={idx}
              className="text-green-400 font-semibold px-2 py-1 bg-slate-800 rounded-md"
            >
              {line.moveUCI}
            </span>
          ))}
        </div>

        <div className="flex flex-row gap-3 mt-4">
          <Button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            disabled={currentIdx === positions.length - 1}
            onClick={() => setCurrentIdx(currentIdx + 1)}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </Card>

      <Card
        title="Move Classifications"
        className="p-4 max-h-1/3 overflow-y-auto"
      >
        <div className="grid grid-cols-3 font-semibold text-slate-300 mb-2 px-2 py-3">
          <span className="text-left">White</span>
          <span className="text-center">Type</span>
          <span className="text-right">Black</span>
        </div>

        {Array.from(
          new Set([
            ...Object.keys(classifications.white),
            ...Object.keys(classifications.black),
          ])
        ).map((cls) => {
          const w = classifications.white[cls as Classification] ?? 0;
          const b = classifications.black[cls as Classification] ?? 0;

          return (
            <div
              key={cls}
              className="grid grid-cols-3 items-center py-1 px-2 rounded-md hover:bg-slate-700/50 transition"
            >
              <span className="text-left font-bold text-slate-100">{w}</span>
              <span className="text-center capitalize text-slate-300">
                {cls}
              </span>
              <span className="text-right font-bold text-slate-100">{b}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

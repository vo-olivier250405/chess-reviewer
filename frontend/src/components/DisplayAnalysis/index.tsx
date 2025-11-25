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

  const sortClassifications = (cls: Record<Classification, number>) =>
    Object.entries(cls).sort((a, b) => b[1] - a[1]);

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card title="Accuracy Comparison" className="w-full p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400 font-semibold">
              White: {Math.floor(accuracies.white)}%
            </span>
            <span className="text-red-400 font-semibold">
              Black: {Math.floor(accuracies.black)}%
            </span>
          </div>
          <div className="relative w-full h-4 bg-slate-600 rounded-md overflow-hidden">
            <div
              className="absolute left-0 top-0 h-4 bg-green-400 transition-all duration-500"
              style={{ width: `${whitePercent}%` }}
            />
            <div
              className="absolute right-0 top-0 h-4 bg-red-400 transition-all duration-500"
              style={{ width: `${blackPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Liste des positions / coups */}
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

        {/* Navigation */}
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

      {/* Classification par coups */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="White Classifications" className="p-4">
          {sortClassifications(classifications.white).map(
            ([cls, count], idx) => (
              <div key={idx} className="flex justify-between mb-1">
                <span className="capitalize">{cls}</span>
                <span className="font-bold">{count}</span>
              </div>
            )
          )}
        </Card>

        <Card title="Black Classifications" className="p-4">
          {sortClassifications(classifications.black).map(
            ([cls, count], idx) => (
              <div key={idx} className="flex justify-between mb-1">
                <span className="capitalize">{cls}</span>
                <span className="font-bold">{count}</span>
              </div>
            )
          )}
        </Card>
      </div>
    </div>
  );
};

// export const DisplayAnalysis: FC<DisplayAnalysisProps> = (
//   { data, className },
//   ...props
// ) => {
//   const { positions, accuracies, classifications } = data;
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const currentPosition = positions[currentIdx];

//   // Calcul du pourcentage pour la jauge
//   const whitePercentage =
//     (accuracies.white / (accuracies.white + accuracies.black)) * 100;

//   // Couleurs pour les classifications
//   const classificationColors: Record<string, string> = {
//     brilliant: "bg-cyan-400 text-cyan-950",
//     great: "bg-green-500 text-green-950",
//     best: "bg-green-600 text-white",
//     excellent: "bg-green-700 text-white",
//     good: "bg-lime-500 text-lime-950",
//     book: "bg-amber-600 text-white",
//     inaccuracy: "bg-orange-500 text-orange-950",
//     mistake: "bg-orange-600 text-white",
//     blunder: "bg-red-600 text-white",
//     missed: "bg-yellow-500 text-yellow-950",
//   };

//   const classificationLabels: Record<string, string> = {
//     brilliant: "Brillant",
//     great: "Excellent",
//     best: "Meilleur",
//     excellent: "Très bon",
//     good: "Bon",
//     book: "Théorie",
//     inaccuracy: "Imprécision",
//     mistake: "Erreur",
//     blunder: "Gaffe",
//     missed: "Manqué",
//   };

//   return (
//     <div className={cn("space-y-6", className)} {...props}>
//       {/* Jauge de précision */}
//       <Card withHoverEffect={false} title="Précision de la partie">
//         <div className="space-y-3">
//           <div className="flex justify-between text-sm font-semibold mb-2">
//             <span className="text-white">
//               Blancs: {accuracies.white.toFixed(1)}%
//             </span>
//             <span className="text-gray-300">
//               Noirs: {accuracies.black.toFixed(1)}%
//             </span>
//           </div>
//           <div className="relative h-8 bg-gray-700 rounded-lg overflow-hidden">
//             <div
//               className="absolute left-0 top-0 h-full bg-white transition-all duration-500"
//               style={{ width: `${whitePercentage}%` }}
//             />
//             <div
//               className="absolute right-0 top-0 h-full bg-gray-900 transition-all duration-500"
//               style={{ width: `${100 - whitePercentage}%` }}
//             />
//           </div>
//         </div>
//       </Card>

//       {/* Classifications */}
//       <Card withHoverEffect={false} title="Analyse des coups">
//         <div className="grid grid-cols-2 gap-6">
//           {/* Blancs */}
//           <div>
//             <h4 className="text-sm font-bold text-white mb-3">Blancs</h4>
//             <div className="space-y-2">
//               {Object.entries(classifications.white).map(
//                 ([classification, count]) =>
//                   count > 0 ? (
//                     <div
//                       key={classification}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <span
//                           className={cn(
//                             "px-2 py-1 rounded text-xs font-semibold",
//                             classificationColors[classification]
//                           )}
//                         >
//                           {count}
//                         </span>
//                         <span className="text-sm text-gray-300">
//                           {classificationLabels[classification] ||
//                             classification}
//                         </span>
//                       </div>
//                     </div>
//                   ) : null
//               )}
//             </div>
//           </div>

//           {/* Noirs */}
//           <div>
//             <h4 className="text-sm font-bold text-gray-300 mb-3">Noirs</h4>
//             <div className="space-y-2">
//               {Object.entries(classifications.black).map(
//                 ([classification, count]) =>
//                   count > 0 ? (
//                     <div
//                       key={classification}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <span
//                           className={cn(
//                             "px-2 py-1 rounded text-xs font-semibold",
//                             classificationColors[classification]
//                           )}
//                         >
//                           {count}
//                         </span>
//                         <span className="text-sm text-gray-300">
//                           {classificationLabels[classification] ||
//                             classification}
//                         </span>
//                       </div>
//                     </div>
//                   ) : null
//               )}
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Position courante */}
//       <Card
//         withHoverEffect={false}
//         title={`${currentPosition.move.san} - ${currentIdx === 0 ? "Premier coup" : classificationLabels[currentPosition.classification!] || currentPosition.classification}`}
//       >
//         <div className="space-y-3">
//           <p className="text-green-400 text-sm font-semibold">
//             Meilleurs coups :
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {currentPosition.topLines?.map((line, idx) => (
//               <span
//                 key={idx}
//                 className="bg-green-600/20 text-green-400 px-3 py-1 rounded-md font-mono text-sm font-bold border border-green-600/30"
//               >
//                 {line.moveUCI}
//               </span>
//             ))}
//           </div>
//         </div>
//       </Card>

//       {/* Navigation */}
//       <div className="flex justify-center items-center gap-4">
//         <Button
//           disabled={currentIdx === 0}
//           onClick={() => setCurrentIdx(currentIdx - 1)}
//           className="disabled:opacity-50"
//         >
//           <ChevronLeft className="size-5" />
//         </Button>
//         <span className="text-sm text-gray-400 font-medium">
//           Coup {currentIdx + 1} / {positions.length}
//         </span>
//         <Button
//           disabled={currentIdx === positions.length - 1}
//           onClick={() => setCurrentIdx(currentIdx + 1)}
//           className="disabled:opacity-50"
//         >
//           <ChevronRight className="size-5" />
//         </Button>
//       </div>
//     </div>
//   );
// };

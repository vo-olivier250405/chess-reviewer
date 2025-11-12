import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SearchModeOption, SearchMode } from "@/types/SearchMode";
import type { FC } from "react";

interface SearchModeDropdownMenuProps {
  modes: SearchModeOption[];
  onSelect: (mode: SearchMode) => void;
}

const SearchModeDropdownMenu: FC<SearchModeDropdownMenuProps> = ({
  modes,
  onSelect,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{modes[0].label}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {modes.map((mode) => (
          <DropdownMenuItem
            key={mode.value}
            onClick={() => onSelect?.(mode.value)}
          >
            {mode.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchModeDropdownMenu;

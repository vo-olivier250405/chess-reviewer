import SearchModeDropdownMenu from "@/components/Dropdown/SearchMode";
import { FullScreenSidebar } from "@/components/FullScreenSidebar";
import Main from "@/components/Main";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MODES } from "@/constants";
import type { SearchMode } from "@/types/SearchMode";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchMode, setSearchMode] = useState<SearchMode>("pgn");

  return (
    <Main>
      <FullScreenSidebar.Provider
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
      >
        <FullScreenSidebar.Content>
          <FullScreenSidebar.Trigger>
            {isOpen ? (
              <div className="flex flex-row gap-2">
                <Input type="text" />
                <SearchModeDropdownMenu
                  modes={MODES}
                  onSelect={(mode) => setSearchMode(mode)}
                />
              </div>
            ) : (
              <Button>
                <ArrowLeft />
              </Button>
            )}
          </FullScreenSidebar.Trigger>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,
          consequatur maiores quod tempore eius optio doloremque laborum? Minus
          praesentium iste provident atque. Molestiae fugiat iusto voluptate?
          Labore facilis ipsa alias.
        </FullScreenSidebar.Content>
      </FullScreenSidebar.Provider>
    </Main>
  );
}

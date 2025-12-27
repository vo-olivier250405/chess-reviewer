import { useCallback, useEffect } from "react";

export interface UseArrowNavigationOptions {
  handleLeft: () => void;
  handleRight: () => void;
  enabled?: boolean;
  beforeKey?: string;
  afterKey?: string;
}

const useArrowNavigation = ({
  handleLeft,
  handleRight,
  enabled = true,
  beforeKey = "ArrowLeft",
  afterKey = "ArrowRight",
}: UseArrowNavigationOptions): void => {
  const onArrowLeft = useCallback(handleLeft, [handleLeft]);
  const onArrowRight = useCallback(handleRight, [handleRight]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === beforeKey) {
      event.preventDefault();
      onArrowLeft();
    } else if (event.key == afterKey) {
      event.preventDefault();
      onArrowRight();
    }
  };

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onArrowLeft, onArrowRight, enabled]);
};

export default useArrowNavigation;

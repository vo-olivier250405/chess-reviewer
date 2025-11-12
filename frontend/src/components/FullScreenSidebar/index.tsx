import { cn } from "@/lib/utils";
import * as React from "react";

interface FullScreenSidebarContextProps {
  isOpen: boolean;
  onClose: () => void;
}
const FullScreenSidebarContext =
  React.createContext<FullScreenSidebarContextProps>(
    {} as FullScreenSidebarContextProps
  );

const useFullScreenSidebarContext = () => {
  const context = React.useContext(FullScreenSidebarContext);
  if (!context) {
    throw new Error(
      "useFullScreenSidebarContext must be used within a FullScreenSidebarProvider"
    );
  }
  return context;
};

interface FullScreenSidebarProviderProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Provider: React.FC<FullScreenSidebarProviderProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <FullScreenSidebarContext.Provider value={{ isOpen, onClose }}>
      {children}
    </FullScreenSidebarContext.Provider>
  );
};

interface FullScreenSidebarTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Trigger: React.FC<FullScreenSidebarTriggerProps> = ({
  children,
  className,
  ...props
}) => {
  const { onClose } = useFullScreenSidebarContext();
  return (
    <div {...props} onClick={onClose} className={cn(className)}>
      {children}
    </div>
  );
};

interface FullScreenSidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Content: React.FC<FullScreenSidebarContentProps> = ({
  children,
  className,
  ...props
}) => {
  const { isOpen } = useFullScreenSidebarContext();
  const openClassName = React.useMemo(() => {
    return isOpen ? "w-full" : "w-1/3";
  }, [isOpen]);

  return (
    <div
      {...props}
      className={cn(
        " absolute right-0 top-0 size-full p-4 bg-slate-800 transition-all duration-300",
        openClassName,
        className
      )}
    >
      {/* <Button onClick={() => onClose()}>Close Sidebar</Button> */}
      {children}
    </div>
  );
};

export const FullScreenSidebar = {
  Provider,
  Trigger,
  Content,
};


import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  className?: string;
}

const MobileMenu = ({ sidebarOpen, setSidebarOpen, className = "" }: MobileMenuProps) => {
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="p-0 w-10 h-10 -ml-1 text-gray-500"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default MobileMenu;

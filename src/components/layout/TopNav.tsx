
import React from "react";
import { MobileMenu } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";

interface TopNavProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const TopNav = ({ sidebarOpen, setSidebarOpen }: TopNavProps) => {
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <MobileMenu
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        className="border-r border-gray-200 px-4 md:hidden"
      />
      <div className="flex flex-1 justify-between px-4">
        <div className="flex flex-1">
          <div className="flex w-full md:ml-0">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <Input
                id="search-field"
                className="block h-full w-full border-transparent py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">View notifications</span>
          </Button>
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default TopNav;

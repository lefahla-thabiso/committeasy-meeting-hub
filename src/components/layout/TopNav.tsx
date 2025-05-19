
import React from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TopNav = () => {
  return (
    <header className="bg-white border-b border-gray-200 z-20">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
              placeholder="Search meetings, documents..." 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            + New Meeting
          </Button>
          
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;

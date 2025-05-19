
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, FileText, CheckSquare, List, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/data/mockData";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { name: "Dashboard", icon: Calendar, path: "/" },
    { name: "Meetings", icon: List, path: "/meetings" },
    { name: "Committees", icon: Users, path: "/committees" },
    { name: "Documents", icon: FileText, path: "/documents" },
    { name: "Action Items", icon: CheckSquare, path: "/actions" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 h-screen",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="text-xl font-bold text-blue-600">MeetManager</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("ml-auto")}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-blue-50 hover:text-blue-700",
                  "focus:outline-none focus:bg-blue-50 focus:text-blue-700",
                  window.location.pathname === item.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                )}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className={cn("absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200")}>
          <div className="flex items-center">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="h-8 w-8 rounded-full"
            />
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

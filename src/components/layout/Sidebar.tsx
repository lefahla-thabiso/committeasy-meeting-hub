
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, FileText, CheckSquare, List, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/mockData";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";

const Sidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: Calendar, path: "/" },
    { name: "Meetings", icon: List, path: "/meetings" },
    { name: "Committees", icon: Users, path: "/committees" },
    { name: "Documents", icon: FileText, path: "/documents" },
    { name: "Action Items", icon: CheckSquare, path: "/actions" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        {state !== "collapsed" && (
          <div className="text-xl font-bold text-blue-600">MeetManager</div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.name}
              >
                <Link to={item.path} className="flex items-center">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="h-8 w-8 rounded-full"
          />
          {state !== "collapsed" && (
            <div>
              <p className="text-sm font-medium text-gray-700 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;

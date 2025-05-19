
import React from "react";
import StatsOverview from "@/components/dashboard/StatsOverview";
import CalendarView from "@/components/dashboard/CalendarView";
import ActionItemsWidget from "@/components/dashboard/ActionItemsWidget";
import CommitteesWidget from "@/components/dashboard/CommitteesWidget";
import RecentDocumentsWidget from "@/components/dashboard/RecentDocumentsWidget";
import { currentUser } from "@/data/mockData";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {currentUser.name}</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView />
        </div>
        <div>
          <ActionItemsWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CommitteesWidget />
        <RecentDocumentsWidget />
      </div>
    </div>
  );
};

export default Dashboard;


import React from "react";
import StatsOverview from "@/components/dashboard/StatsOverview";
import CalendarView from "@/components/dashboard/CalendarView";
import ActionItemsWidget from "@/components/dashboard/ActionItemsWidget";
import CommitteesWidget from "@/components/dashboard/CommitteesWidget";
import RecentDocumentsWidget from "@/components/dashboard/RecentDocumentsWidget";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardProps {
  upcomingMeetings?: any[];
  loading?: boolean;
}

const Dashboard = ({ upcomingMeetings = [], loading = false }: DashboardProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
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
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Upcoming Meetings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.length > 0 ? (
                    upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="border-b pb-3 last:border-b-0">
                        <div className="font-medium">{meeting.title}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1 justify-between">
                          <div>{format(new Date(meeting.start_time), "MMM d, h:mm a")}</div>
                          {meeting.committee && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Users size={12} />
                              <span>{meeting.committee.name}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No upcoming meetings
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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

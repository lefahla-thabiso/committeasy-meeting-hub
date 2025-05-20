
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MeetingCard from "./MeetingCard";
import EmptyMeetingsState from "./EmptyMeetingsState";
import { Database } from "@/integrations/supabase/types";

// Define the Meeting type with correct structure
type Meeting = Database['public']['Tables']['meetings']['Row'] & {
  organizer?: {
    name: string;
    avatar: string | null;
  } | null;
  committee?: {
    name: string;
  } | null;
  attendee_count: number;
};

interface MeetingsListProps {
  meetings: Meeting[];
  loading: boolean;
  onScheduleClick: () => void;
}

const MeetingsList = ({ meetings, loading, onScheduleClick }: MeetingsListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mt-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (meetings.length === 0) {
    return <EmptyMeetingsState onScheduleClick={onScheduleClick} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
};

export default MeetingsList;

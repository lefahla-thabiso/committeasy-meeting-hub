
import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

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

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard = ({ meeting }: MeetingCardProps) => {
  const navigate = useNavigate();

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'in_progress':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleClick = () => {
    navigate(`/meetings/${meeting.id}`);
  };

  return (
    <Card 
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>{meeting.title}</span>
        </CardTitle>
        <p className="text-sm text-gray-500">
          {meeting.description || "No description provided"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">Time: </span>
              {format(new Date(meeting.start_time), "MMM d, yyyy h:mm a")} - 
              {format(new Date(meeting.end_time), "h:mm a")}
            </div>
            <Badge className={getMeetingStatusColor(meeting.status)}>
              {meeting.status.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="text-sm">
            <span className="font-medium">Location: </span>
            {meeting.is_virtual ? 
              (meeting.meeting_link || "Virtual Meeting") : 
              (meeting.location || "Not specified")}
          </div>
          
          {meeting.committee && (
            <div className="text-sm">
              <span className="font-medium">Committee: </span>
              {meeting.committee.name}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            {meeting.organizer ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={meeting.organizer.avatar || undefined} alt={meeting.organizer.name} />
                  <AvatarFallback>{meeting.organizer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{meeting.organizer.name}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No organizer assigned</span>
            )}
            <Badge variant="outline">
              {meeting.attendee_count} attendees
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;

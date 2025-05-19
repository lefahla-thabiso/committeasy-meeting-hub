
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

// Define the Meeting type with correct structure matching Supabase response
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

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            organizer:organizer_id(name, avatar),
            committee:committee_id(name),
            attendee_count:meeting_attendees(count)
          `)
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Error fetching meetings:', error);
          return;
        }

        // Transform data to match Meeting type
        const transformedData = data.map(item => ({
          ...item,
          attendee_count: item.attendee_count?.[0]?.count || 0
        })) as Meeting[];

        setMeetings(transformedData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

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

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meetings</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>

        {loading ? (
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                      {meeting.is_virtual ? "Virtual Meeting" : meeting.location || "Not specified"}
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
            ))}

            {meetings.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No meetings found</h3>
                <p className="mt-1 text-gray-500">Get started by scheduling a new meeting.</p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Meetings;

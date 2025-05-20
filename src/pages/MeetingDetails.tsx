
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Users, MapPin, Edit, ArrowLeft, Clock } from "lucide-react";
import EditMeetingDialog from "@/components/meetings/EditMeetingDialog";

// Define the Meeting type with correct structure
type Meeting = Database['public']['Tables']['meetings']['Row'] & {
  organizer?: {
    name: string;
    avatar: string | null;
  } | null;
  committee?: {
    name: string;
  } | null;
  attendees?: {
    profile: {
      id: string;
      name: string;
      avatar: string | null;
    };
    status: string;
  }[];
  documents?: {
    id: string;
    title: string;
    url: string;
    uploaded_at: string;
  }[];
};

const MeetingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMeetingDetails();
  }, [id]);

  const fetchMeetingDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          organizer:organizer_id(name, avatar),
          committee:committee_id(name),
          attendees:meeting_attendees(profile:profile_id(id, name, avatar), status),
          documents:documents(id, title, url, uploaded_at)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching meeting details:', error);
        toast({
          title: "Error",
          description: "Failed to load meeting details",
          variant: "destructive",
        });
        return;
      }

      setMeeting(data as Meeting);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        ) : meeting ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{meeting.title}</h1>
                  <Badge className={getMeetingStatusColor(meeting.status)}>
                    {meeting.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-lg text-gray-600 mt-2">{meeting.description || "No description provided"}</p>
              </div>
              <Button onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Meeting
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Meeting Details</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-gray-600">
                        {meeting.start_time && format(new Date(meeting.start_time), "MMMM d, yyyy")}
                      </p>
                      <p className="text-gray-600">
                        {meeting.start_time && format(new Date(meeting.start_time), "h:mm a")} - 
                        {meeting.end_time && format(new Date(meeting.end_time), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">
                        {meeting.is_virtual 
                          ? (meeting.meeting_link || "Virtual Meeting")
                          : (meeting.location || "Not specified")}
                      </p>
                      {meeting.is_virtual && meeting.meeting_link && (
                        <a 
                          href={meeting.meeting_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>

                  {meeting.committee && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Committee</p>
                        <p className="text-gray-600">{meeting.committee.name}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-gray-600">
                        {meeting.start_time && meeting.end_time && (
                          `${Math.round((new Date(meeting.end_time).getTime() - new Date(meeting.start_time).getTime()) / (1000 * 60))} minutes`
                        )}
                      </p>
                    </div>
                  </div>

                  {meeting.organizer && (
                    <div className="flex items-start">
                      <div className="h-5 w-5 mr-3" />
                      <div>
                        <p className="font-medium">Organizer</p>
                        <div className="flex items-center mt-1">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={meeting.organizer.avatar || undefined} alt={meeting.organizer.name} />
                            <AvatarFallback>{meeting.organizer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{meeting.organizer.name}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Attendees</h2>
                
                {meeting.attendees && meeting.attendees.length > 0 ? (
                  <div className="space-y-3">
                    {meeting.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={attendee.profile.avatar || undefined} alt={attendee.profile.name} />
                            <AvatarFallback>{attendee.profile.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{attendee.profile.name}</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {attendee.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No attendees added yet</p>
                )}

                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Documents</h2>
                  
                  {meeting.documents && meeting.documents.length > 0 ? (
                    <div className="space-y-2">
                      {meeting.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span>{doc.title}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(doc.url, "_blank")}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Meeting not found</h2>
            <p className="text-gray-500 mt-2">The meeting you are looking for does not exist or has been removed</p>
            <Button className="mt-4" onClick={() => navigate('/meetings')}>
              Back to Meetings
            </Button>
          </div>
        )}
      </div>

      {meeting && (
        <EditMeetingDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          meeting={meeting}
          onSuccess={fetchMeetingDetails}
        />
      )}
    </MainLayout>
  );
};

export default MeetingDetails;

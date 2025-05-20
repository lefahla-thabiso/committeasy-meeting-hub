
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ScheduleMeetingDialog from "@/components/meetings/ScheduleMeetingDialog";
import MeetingsList from "@/components/meetings/MeetingsList";
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

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const { toast } = useToast();

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
        toast({
          title: "Error",
          description: "Failed to load meetings",
          variant: "destructive",
        });
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

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meetings</h1>
          <Button onClick={() => setScheduleDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>

        <MeetingsList 
          meetings={meetings}
          loading={loading}
          onScheduleClick={() => setScheduleDialogOpen(true)}
        />
      </div>

      <ScheduleMeetingDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        onSuccess={fetchMeetings}
      />
    </MainLayout>
  );
};

export default Meetings;

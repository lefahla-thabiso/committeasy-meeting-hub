
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "./Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Using Dashboard component to render content
const Index = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        setLoading(true);
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            organizer:organizer_id(name, avatar),
            committee:committee_id(name)
          `)
          .gte('start_time', now)
          .order('start_time', { ascending: true })
          .limit(5);

        if (error) {
          console.error('Error fetching upcoming meetings:', error);
          return;
        }

        setUpcomingMeetings(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMeetings();
  }, []);

  return (
    <MainLayout>
      <Dashboard upcomingMeetings={upcomingMeetings} loading={loading} />
    </MainLayout>
  );
};

export default Index;

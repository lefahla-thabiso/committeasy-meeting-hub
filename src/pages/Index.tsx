
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "./Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

// Using Dashboard component to render content
const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: upcomingMeetings, isLoading } = useQuery({
    queryKey: ['upcomingMeetings', user?.id],
    queryFn: async () => {
      try {
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
          toast({
            title: "Error",
            description: "Failed to fetch upcoming meetings",
            variant: "destructive",
          });
          console.error('Error fetching upcoming meetings:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Error:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  return (
    <MainLayout>
      <Dashboard upcomingMeetings={upcomingMeetings || []} loading={isLoading} />
    </MainLayout>
  );
};

export default Index;

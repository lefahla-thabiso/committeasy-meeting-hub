
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

// Define the Meeting type with Supabase structure
type Meeting = Database['public']['Tables']['meetings']['Row'] & {
  organizer?: {
    name: string;
    avatar: string | null;
  } | null;
  committee?: {
    name: string;
  } | null;
};

const Index = () => {
  // Fetch upcoming meetings for the dashboard
  const { data: meetings, isLoading } = useQuery({
    queryKey: ['upcomingMeetings'],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          organizer:organizer_id(name, avatar),
          committee:committee_id(name)
        `)
        .gte('start_time', now)
        .order('start_time')
        .limit(3);
      
      if (error) {
        console.error('Error fetching upcoming meetings:', error);
        throw new Error(error.message);
      }
      
      return data as Meeting[];
    }
  });

  return (
    <MainLayout>
      <Dashboard upcomingMeetings={meetings || []} loading={isLoading} />
    </MainLayout>
  );
};

export default Index;

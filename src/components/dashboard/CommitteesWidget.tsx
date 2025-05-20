
import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

type Committee = Database['public']['Tables']['committees']['Row'] & {
  chair?: {
    name: string;
    avatar: string | null;
  } | null;
  members: {
    profile: {
      id: string;
      name: string;
      avatar: string | null;
    }
  }[];
};

const CommitteesWidget = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('committees')
        .select(`
          *,
          chair:chair_id(name, avatar),
          members:committee_members(profile:profile_id(id, name, avatar))
        `)
        .order('name')
        .limit(5);

      if (error) {
        console.error('Error fetching committees:', error);
        return;
      }

      setCommittees(data as Committee[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitteeClick = (id: string) => {
    navigate(`/committees/${id}`);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Your Committees</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <div className="flex -space-x-2 overflow-hidden">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-6 w-6 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {committees.map((committee) => (
              <div 
                key={committee.id} 
                className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                onClick={() => handleCommitteeClick(committee.id)}
              >
                <div className="font-medium">{committee.name}</div>
                <div className="text-sm text-gray-500 truncate">{committee.description}</div>
                <div className="mt-2 flex -space-x-2 overflow-hidden">
                  {committee.members.slice(0, 5).map((member, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-white">
                      <AvatarImage src={member.profile.avatar || undefined} alt={member.profile.name} />
                      <AvatarFallback>{member.profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {committee.members.length > 5 && (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium">
                      +{committee.members.length - 5}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {committees.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                You are not a member of any committees
              </div>
            )}
            
            {committees.length > 0 && (
              <div className="text-center pt-2">
                <a href="/committees" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  View all committees
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommitteesWidget;


import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Define the ActionItem type with correct structure matching Supabase response
type ActionItem = Database['public']['Tables']['action_items']['Row'] & {
  meeting?: {
    title: string;
  } | null;
  assignees: {
    id: string;
    name: string;
    avatar: string | null;
  }[];
};

const ActionItems = () => {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActionItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('action_items')
          .select(`
            *,
            meeting:meeting_id(title),
            assignees:action_item_assignees(profile:profile_id(id, name, avatar))
          `)
          .order('due_date', { ascending: true });

        if (error) {
          console.error('Error fetching action items:', error);
          return;
        }

        // Transform data to match ActionItem type
        const transformedData = data.map(item => ({
          ...item,
          assignees: item.assignees.map(assignee => assignee.profile)
        })) as ActionItem[];

        setActionItems(transformedData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionItems();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Action Items</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Action Item
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {actionItems.map((item) => (
              <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckSquare className={cn(
                          "h-5 w-5",
                          item.status === 'completed' ? "text-green-600" : 
                          item.status === 'in_progress' ? "text-blue-600" : "text-gray-600"
                        )} />
                        <h3 className="font-medium text-lg">{item.title}</h3>
                      </div>
                      {item.description && (
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 mt-3">
                        {item.meeting && (
                          <div className="text-sm">
                            <span className="text-gray-500">Meeting: </span>
                            <span>{item.meeting.title}</span>
                          </div>
                        )}
                        
                        {item.due_date && (
                          <div className="text-sm">
                            <span className="text-gray-500">Due: </span>
                            <span className={cn(
                              new Date(item.due_date) < new Date() && item.status !== 'completed' 
                                ? "text-red-600 font-medium" 
                                : ""
                            )}>
                              {format(new Date(item.due_date), "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Assigned to:</span>
                      <div className="flex -space-x-2">
                        {item.assignees.map((assignee, index) => (
                          <Avatar key={index} className="h-7 w-7 border-2 border-white">
                            <AvatarImage src={assignee.avatar || undefined} alt={assignee.name} />
                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {item.assignees.length === 0 && (
                          <span className="text-sm text-gray-500">No assignees</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Created {format(new Date(item.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {actionItems.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No action items found</h3>
                <p className="mt-1 text-gray-500">Get started by creating a new action item.</p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Action Item
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ActionItems;

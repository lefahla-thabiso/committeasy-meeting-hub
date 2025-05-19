
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Committee = Database['public']['Tables']['committees']['Row'] & {
  chair?: {
    name: string;
    avatar: string | null;
  } | null;
  member_count: number;
};

const Committees = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('committees')
          .select(`
            *,
            chair:chair_id(name, avatar),
            member_count:committee_members(count)
          `)
          .order('name');

        if (error) {
          console.error('Error fetching committees:', error);
          return;
        }

        setCommittees(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Committees</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Committee
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((committee) => (
              <Card key={committee.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>{committee.name}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {committee.description || "No description provided"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {committee.chair ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={committee.chair.avatar || undefined} alt={committee.chair.name} />
                            <AvatarFallback>{committee.chair.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{committee.chair.name}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">No chair assigned</span>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {committee.member_count} members
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {committees.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No committees found</h3>
                <p className="mt-1 text-gray-500">Get started by creating a new committee.</p>
                <Button className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Committee
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Committees;


import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { committees } from "@/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CommitteesWidget = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Your Committees</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {committees.map((committee) => (
            <div key={committee.id} className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
              <div className="font-medium">{committee.name}</div>
              <div className="text-sm text-gray-500 truncate">{committee.description}</div>
              <div className="mt-2 flex -space-x-2 overflow-hidden">
                {committee.members.slice(0, 5).map((member, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-white">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitteesWidget;

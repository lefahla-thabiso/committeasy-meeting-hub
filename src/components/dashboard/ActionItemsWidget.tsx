
import React from "react";
import { CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getUserActionItems, currentUser } from "@/data/mockData";
import { format } from "date-fns";

const ActionItemsWidget = () => {
  const actionItems = getUserActionItems(currentUser.id);
  
  // Sort by due date (closest first)
  const sortedItems = [...actionItems].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Calculate stats
  const total = sortedItems.length;
  const completed = sortedItems.filter(item => item.status === "completed").length;
  const inProgress = sortedItems.filter(item => item.status === "inProgress").length;
  const pending = sortedItems.filter(item => item.status === "pending").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-blue-600" />
          <span>Your Action Items</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span>{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>
        
        <div className="flex gap-2 mb-4">
          <div className="flex-1 text-center p-2 bg-gray-50 rounded-md">
            <div className="text-lg font-semibold">{pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="flex-1 text-center p-2 bg-blue-50 rounded-md">
            <div className="text-lg font-semibold text-blue-700">{inProgress}</div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
          <div className="flex-1 text-center p-2 bg-green-50 rounded-md">
            <div className="text-lg font-semibold text-green-700">{completed}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>

        <div className="space-y-3">
          {sortedItems.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">
                  Due {format(new Date(item.dueDate), "MMM d, yyyy")}
                </div>
              </div>
              <Badge
                className={cn(
                  item.status === "completed" && "bg-green-100 text-green-800 hover:bg-green-200",
                  item.status === "inProgress" && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                  item.status === "pending" && "bg-gray-100 text-gray-800 hover:bg-gray-200"
                )}
              >
                {item.status === "inProgress" ? "In Progress" : item.status}
              </Badge>
            </div>
          ))}
          
          {sortedItems.length > 5 && (
            <div className="text-center pt-2">
              <a href="/actions" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                View all ({sortedItems.length}) action items
              </a>
            </div>
          )}
          
          {sortedItems.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No action items assigned to you
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionItemsWidget;

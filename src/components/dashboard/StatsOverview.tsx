
import React from "react";
import { Calendar, Clock, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Upcoming Meetings",
    value: "7",
    change: "+2",
    changeType: "increase",
    icon: Calendar,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Pending Actions",
    value: "12",
    change: "-4",
    changeType: "decrease",
    icon: List,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Hours in Meetings",
    value: "8.5",
    change: "+1.5",
    changeType: "increase",
    icon: Clock,
    color: "bg-emerald-100 text-emerald-600",
  },
];

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <span 
                    className={`text-xs font-medium ${
                      stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">this week</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;

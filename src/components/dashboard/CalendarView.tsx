
import React from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { generateUpcomingMeetings, currentUser } from "@/data/mockData";
import { Meeting } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const CalendarView = () => {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  const upcomingMeetings = generateUpcomingMeetings(currentUser);
  
  // Group meetings by day
  const meetingsByDay = weekDays.map(day => {
    return {
      date: day,
      meetings: upcomingMeetings.filter(meeting => 
        isSameDay(day, new Date(meeting.startTime))
      )
    };
  });

  const getMeetingTime = (meeting: Meeting) => {
    const start = new Date(meeting.startTime);
    const end = new Date(meeting.endTime);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-blue-600" />
          <span>Weekly Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center">
              <div className="text-xs text-gray-500 font-medium mb-1">
                {format(day, "EEE")}
              </div>
              <div 
                className={cn(
                  "text-sm font-semibold h-7 w-7 rounded-full mx-auto flex items-center justify-center",
                  isSameDay(day, today) ? "bg-blue-600 text-white" : ""
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-4">
          {meetingsByDay.map((dayData, i) => (
            dayData.meetings.length > 0 && (
              <div key={i} className="border-t pt-3">
                <div className="font-medium mb-2">
                  {isSameDay(dayData.date, today) ? "Today" : format(dayData.date, "EEEE, MMMM d")}
                </div>
                <div className="space-y-2">
                  {dayData.meetings.map(meeting => (
                    <div 
                      key={meeting.id} 
                      className="flex items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{meeting.title}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-3">
                          <span>{getMeetingTime(meeting)}</span>
                          {meeting.isVirtual ? 
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Virtual</Badge> : 
                            <span className="text-xs text-gray-500">{meeting.location}</span>
                          }
                        </div>
                      </div>
                      {meeting.committee && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Users size={14} className="mr-1" />
                          {meeting.committee.name}
                        </div>
                      )}
                      {meeting.isAdHoc && (
                        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">Ad-hoc</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          
          {upcomingMeetings.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No meetings scheduled for this week
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;

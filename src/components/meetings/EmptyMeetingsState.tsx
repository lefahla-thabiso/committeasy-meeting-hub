
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";

interface EmptyMeetingsStateProps {
  onScheduleClick: () => void;
}

const EmptyMeetingsState = ({ onScheduleClick }: EmptyMeetingsStateProps) => {
  return (
    <div className="col-span-full text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium">No meetings found</h3>
      <p className="mt-1 text-gray-500">Get started by scheduling a new meeting.</p>
      <Button className="mt-4" onClick={onScheduleClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Schedule Meeting
      </Button>
    </div>
  );
};

export default EmptyMeetingsState;

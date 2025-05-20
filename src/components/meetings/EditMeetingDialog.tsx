
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the Meeting type
type Meeting = Database['public']['Tables']['meetings']['Row'] & {
  organizer?: {
    name: string;
    avatar: string | null;
  } | null;
  committee?: {
    name: string;
  } | null;
};

interface EditMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: Meeting;
  onSuccess: () => void;
}

const EditMeetingDialog = ({ open, onOpenChange, meeting, onSuccess }: EditMeetingDialogProps) => {
  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(meeting.description || "");
  const [date, setDate] = useState<Date | undefined>(meeting.start_time ? new Date(meeting.start_time) : undefined);
  const [startTime, setStartTime] = useState(meeting.start_time ? format(new Date(meeting.start_time), "HH:mm") : "");
  const [endTime, setEndTime] = useState(meeting.end_time ? format(new Date(meeting.end_time), "HH:mm") : "");
  const [isVirtual, setIsVirtual] = useState(meeting.is_virtual);
  const [location, setLocation] = useState(meeting.location || "");
  const [meetingLink, setMeetingLink] = useState(meeting.meeting_link || "");
  const [status, setStatus] = useState(meeting.status);
  const [isAdHoc, setIsAdHoc] = useState(meeting.is_ad_hoc);
  const [committeeId, setCommitteeId] = useState<string | null>(meeting.committee_id);
  const [committees, setCommittees] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCommittees();
  }, []);

  const fetchCommittees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('committees')
        .select('id, name')
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

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Meeting date is required",
        variant: "destructive",
      });
      return;
    }

    if (!startTime || !endTime) {
      toast({
        title: "Error",
        description: "Start and end time are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Create Date objects for start and end time
      const startDateTime = date ? new Date(date) : new Date();
      const endDateTime = date ? new Date(date) : new Date();
      
      // Parse the time strings and set the hours/minutes
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);
      
      startDateTime.setHours(startHours, startMinutes);
      endDateTime.setHours(endHours, endMinutes);

      // Check if end time is after start time
      if (endDateTime <= startDateTime) {
        toast({
          title: "Error",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('meetings')
        .update({
          title,
          description: description || null,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          is_virtual: isVirtual,
          location: !isVirtual ? location : null,
          meeting_link: isVirtual ? meetingLink : null,
          status,
          is_ad_hoc: isAdHoc,
          committee_id: committeeId,
        })
        .eq('id', meeting.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating meeting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update meeting",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meeting description"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="committee">Committee</Label>
              <Select
                value={committeeId || ""}
                onValueChange={(value) => setCommitteeId(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select committee (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {committees.map((committee) => (
                    <SelectItem key={committee.id} value={committee.id}>
                      {committee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isVirtual"
                checked={isVirtual}
                onCheckedChange={setIsVirtual}
              />
              <Label htmlFor="isVirtual">Virtual Meeting</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isAdHoc"
                checked={isAdHoc}
                onCheckedChange={setIsAdHoc}
              />
              <Label htmlFor="isAdHoc">Ad-hoc Meeting</Label>
            </div>
          </div>
          
          {isVirtual ? (
            <div className="grid gap-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Meeting location"
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: Database["public"]["Enums"]["meeting_status"]) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMeetingDialog;

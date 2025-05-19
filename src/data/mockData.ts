
import { User, Committee, Meeting, ActionItem, Document, AgendaItem } from "../types";

// Mock Users
export const users: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john@example.com",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=John+Smith&background=3b82f6&color=fff",
    department: "Executive"
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "member",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
    department: "Finance"
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "member",
    avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=f97316&color=fff",
    department: "Operations"
  },
  {
    id: "user-4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "member",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=8b5cf6&color=fff",
    department: "HR"
  },
  {
    id: "user-5",
    name: "Robert Wilson",
    email: "robert@example.com",
    role: "guest",
    avatar: "https://ui-avatars.com/api/?name=Robert+Wilson&background=ec4899&color=fff",
    department: "IT"
  }
];

// Mock Committees
export const committees: Committee[] = [
  {
    id: "committee-1",
    name: "Executive Committee",
    description: "Responsible for overall governance and strategic decisions",
    members: [users[0], users[1], users[2]],
    chair: users[0],
    created: new Date("2023-01-15")
  },
  {
    id: "committee-2",
    name: "Finance Committee",
    description: "Oversees financial planning, reporting and auditing",
    members: [users[1], users[3], users[4]],
    chair: users[1],
    created: new Date("2023-02-10")
  },
  {
    id: "committee-3",
    name: "HR Committee",
    description: "Handles personnel policies and compensation structures",
    members: [users[0], users[3], users[4]],
    chair: users[3],
    created: new Date("2023-03-05")
  }
];

// Mock Documents
export const documents: Document[] = [
  {
    id: "doc-1",
    title: "Q1 Financial Report",
    url: "#document-1",
    uploadedBy: users[1],
    uploadedAt: new Date("2024-04-10")
  },
  {
    id: "doc-2",
    title: "Strategic Plan 2024-2025",
    url: "#document-2",
    uploadedBy: users[0],
    uploadedAt: new Date("2024-03-25")
  },
  {
    id: "doc-3",
    title: "Annual Budget Proposal",
    url: "#document-3",
    uploadedBy: users[1],
    uploadedAt: new Date("2024-04-15")
  },
  {
    id: "doc-4",
    title: "HR Policy Updates",
    url: "#document-4",
    uploadedBy: users[3],
    uploadedAt: new Date("2024-04-08")
  }
];

// Mock Agenda Items
export const agendaItems: AgendaItem[] = [
  {
    id: "agenda-1",
    title: "Review of Q1 Financial Performance",
    description: "Analysis of Q1 results compared to projections",
    duration: 30,
    presenter: users[1],
    documents: [documents[0]],
    status: "pending"
  },
  {
    id: "agenda-2",
    title: "Strategic Plan Discussion",
    description: "Review and finalize the strategic plan for 2024-2025",
    duration: 45,
    presenter: users[0],
    documents: [documents[1]],
    status: "pending"
  },
  {
    id: "agenda-3",
    title: "Budget Allocation",
    description: "Decide on budget allocation for Q2",
    duration: 30,
    presenter: users[1],
    documents: [documents[2]],
    status: "pending"
  },
  {
    id: "agenda-4",
    title: "HR Policy Updates",
    description: "Review and approve updates to HR policies",
    duration: 20,
    presenter: users[3],
    documents: [documents[3]],
    status: "pending"
  }
];

// Mock Action Items
export const actionItems: ActionItem[] = [
  {
    id: "action-1",
    title: "Prepare Q2 forecast",
    description: "Create detailed projections for Q2 based on Q1 performance",
    assignedTo: [users[1]],
    dueDate: new Date("2024-05-15"),
    status: "pending",
    meetingId: "meeting-1",
    createdAt: new Date("2024-04-22")
  },
  {
    id: "action-2",
    title: "Finalize strategic initiatives",
    description: "Document key strategic initiatives for executive approval",
    assignedTo: [users[0], users[2]],
    dueDate: new Date("2024-05-10"),
    status: "inProgress",
    meetingId: "meeting-1",
    createdAt: new Date("2024-04-22")
  },
  {
    id: "action-3",
    title: "Update department budgets",
    description: "Adjust departmental budgets based on approved allocations",
    assignedTo: [users[1]],
    dueDate: new Date("2024-05-20"),
    status: "pending",
    meetingId: "meeting-2",
    createdAt: new Date("2024-04-25")
  },
  {
    id: "action-4",
    title: "Distribute new HR policies",
    description: "Share updated HR policies with all staff",
    assignedTo: [users[3]],
    dueDate: new Date("2024-05-05"),
    status: "completed",
    meetingId: "meeting-2",
    createdAt: new Date("2024-04-25")
  }
];

// Mock Meetings
export const meetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Q1 Review Meeting",
    description: "Quarterly review of performance and plans",
    startTime: new Date("2024-04-22T10:00:00"),
    endTime: new Date("2024-04-22T12:00:00"),
    location: "Conference Room A",
    isVirtual: false,
    committee: committees[0],
    isAdHoc: false,
    organizer: users[0],
    attendees: [
      { user: users[0], status: "accepted" },
      { user: users[1], status: "accepted" },
      { user: users[2], status: "accepted" }
    ],
    agenda: [agendaItems[0], agendaItems[1]],
    documents: [documents[0], documents[1]],
    actionItems: [actionItems[0], actionItems[1]],
    status: "completed"
  },
  {
    id: "meeting-2",
    title: "Budget Planning Session",
    description: "Planning session for budget allocation",
    startTime: new Date("2024-04-25T14:00:00"),
    endTime: new Date("2024-04-25T16:00:00"),
    location: "Virtual",
    isVirtual: true,
    meetingLink: "https://example.com/meeting",
    committee: committees[1],
    isAdHoc: false,
    organizer: users[1],
    attendees: [
      { user: users[1], status: "accepted" },
      { user: users[3], status: "accepted" },
      { user: users[4], status: "declined" }
    ],
    agenda: [agendaItems[2], agendaItems[3]],
    documents: [documents[2], documents[3]],
    actionItems: [actionItems[2], actionItems[3]],
    status: "completed"
  },
  {
    id: "meeting-3",
    title: "HR Policy Review",
    description: "Review and approve updates to HR policies",
    startTime: new Date("2024-05-05T11:00:00"),
    endTime: new Date("2024-05-05T12:30:00"),
    location: "Conference Room B",
    isVirtual: false,
    committee: committees[2],
    isAdHoc: false,
    organizer: users[3],
    attendees: [
      { user: users[0], status: "tentative" },
      { user: users[3], status: "accepted" },
      { user: users[4], status: "accepted" }
    ],
    agenda: [agendaItems[3]],
    documents: [documents[3]],
    actionItems: [],
    status: "scheduled"
  },
  {
    id: "meeting-4",
    title: "Emergency IT Security Briefing",
    description: "Urgent meeting to discuss recent security incident",
    startTime: new Date("2024-05-02T09:00:00"),
    endTime: new Date("2024-05-02T10:00:00"),
    location: "Virtual",
    isVirtual: true,
    meetingLink: "https://example.com/urgent-meeting",
    isAdHoc: true,
    organizer: users[4],
    attendees: [
      { user: users[0], status: "accepted" },
      { user: users[2], status: "accepted" },
      { user: users[4], status: "accepted" }
    ],
    agenda: [],
    documents: [],
    actionItems: [],
    status: "scheduled"
  },
  {
    id: "meeting-5",
    title: "Strategic Planning Workshop",
    description: "Full-day workshop to develop 5-year strategic plan",
    startTime: new Date("2024-05-10T09:00:00"),
    endTime: new Date("2024-05-10T17:00:00"),
    location: "Conference Center",
    isVirtual: false,
    committee: committees[0],
    isAdHoc: false,
    organizer: users[0],
    attendees: [
      { user: users[0], status: "accepted" },
      { user: users[1], status: "accepted" },
      { user: users[2], status: "tentative" },
      { user: users[3], status: "pending" },
      { user: users[4], status: "pending" }
    ],
    agenda: [],
    documents: [documents[1]],
    actionItems: [],
    status: "scheduled"
  }
];

// Generate upcoming meetings for the next 7 days
export const generateUpcomingMeetings = (currentUser: User): Meeting[] => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  return meetings.filter(meeting => {
    const isAttendee = meeting.attendees.some(
      attendee => attendee.user.id === currentUser.id && 
      (attendee.status === "accepted" || attendee.status === "tentative")
    );
    return isAttendee && meeting.startTime >= today && meeting.startTime <= nextWeek;
  });
};

// Get upcoming action items for a user
export const getUserActionItems = (userId: string): ActionItem[] => {
  return actionItems.filter(item => 
    item.assignedTo.some(user => user.id === userId) && 
    item.status !== "completed"
  );
};

// Get current user - in a real app this would be from authentication
export const currentUser = users[0];

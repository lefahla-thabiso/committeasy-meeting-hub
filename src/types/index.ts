
export type UserRole = 'admin' | 'member' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Committee {
  id: string;
  name: string;
  description: string;
  members: User[];
  chair: User;
  created: Date;
}

export interface Document {
  id: string;
  title: string;
  url: string;
  uploadedBy: User;
  uploadedAt: Date;
  annotations?: Annotation[];
}

export interface Annotation {
  id: string;
  userId: string;
  documentId: string;
  content: string;
  createdAt: Date;
  position?: { x: number, y: number };
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  presenter?: User;
  documents?: Document[];
  status: 'pending' | 'inProgress' | 'completed' | 'deferred';
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignedTo: User[];
  dueDate: Date;
  status: 'pending' | 'inProgress' | 'completed';
  meetingId: string;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  committee?: Committee;
  isAdHoc: boolean;
  organizer: User;
  attendees: {
    user: User;
    status: 'pending' | 'accepted' | 'declined' | 'tentative';
  }[];
  agenda: AgendaItem[];
  documents: Document[];
  actionItems: ActionItem[];
  minutes?: Document;
  status: 'scheduled' | 'inProgress' | 'completed' | 'cancelled';
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'meeting' | 'committee' | 'document' | 'user' | 'actionItem';
  entityId: string;
  timestamp: Date;
  details?: string;
}

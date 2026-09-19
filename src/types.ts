export type UserRole = 'reporter' | 'responder' | 'admin';

export type IncidentCategory = 'medical' | 'security' | 'fire' | 'facility' | 'weather' | 'other';

export type IncidentUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export type IncidentStatus = 
  | 'Reported'
  | 'Under review'
  | 'Verified'
  | 'Assigned'
  | 'Responding'
  | 'Help arrived'
  | 'Resolved'
  | 'Escalated';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  responderSpecialty?: 'first_aid' | 'security' | 'facility';
}

export interface AiIncidentAnalysis {
  category: IncidentCategory;
  urgency: IncidentUrgency;
  confidence: number;
  approximateLocation: string;
  missingInformation: string[];
  explanation: string;
  disclaimer: string;
  analyzedAt: string;
}

export interface Incident {
  id: string;
  reporterId: string;
  reporterName?: string;
  reporterAnonymous: boolean;
  category: IncidentCategory;
  description: string;
  locationName: string;
  zone: string; // e.g., "North Quad", "Library Block", "Residence Hall C"
  mapCoordinates?: { x: number; y: number }; // Relative coordinates on simulated campus map (0-100%)
  imageUrl?: string;
  status: IncidentStatus;
  urgency: IncidentUrgency;
  originalAiUrgency?: IncidentUrgency;
  urgencyOverridden?: boolean;
  adminNotes?: string;
  aiAnalysis?: AiIncidentAnalysis;
  assignedResponderId?: string;
  assignedResponderName?: string;
  duplicateOf?: string; // ID of primary incident if merged
  mergedChildIds?: string[];
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface Responder {
  id: string;
  userId: string;
  name: string;
  type: 'first_aid' | 'security' | 'facility' | 'venue_staff';
  status: 'Available' | 'Dispatched' | 'Off-duty';
  currentZone: string;
  contactRadio: string;
  skills: string[];
  isDemo?: boolean;
}

export interface IncidentAssignment {
  id: string;
  incidentId: string;
  responderId: string;
  assignedBy: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IncidentUpdate {
  id: string;
  incidentId: string;
  actorId: string;
  actorRole: UserRole | 'system';
  actorName: string;
  statusFrom?: IncidentStatus;
  statusTo: IncidentStatus;
  message: string;
  timestamp: string;
}

export interface SafetyCheckin {
  id: string;
  zone: string;
  status: 'safe' | 'need_assistance';
  note?: string;
  timestamp: string;
  isDemo?: boolean;
  isPublic?: boolean;
}

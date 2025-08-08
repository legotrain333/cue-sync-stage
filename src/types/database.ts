export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'stage_manager' | 'operator' | 'director' | 'director_plus' | 'admin';
  created_at: string;
}

export interface Show {
  id: string;
  name: string;
  created_by: string;
  is_active: boolean;
  cue_sheets: CueSheet[];
  created_at: string;
  updated_at: string;
}

export interface CueSheet {
  id: string;
  show_id: string;
  name: string;
  file_url: string;
  cues: Cue[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cue {
  id: string;
  cue_sheet_id: string;
  cue_number: string;
  department: string;
  sub_cue_number?: string;
  description: string;
  notes?: string;
  hold: boolean;
  color_code?: string;
  timestamp?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CueProgress {
  id: string;
  show_id: string;
  current_cue_id: string;
  status: 'waiting' | 'standby' | 'go' | 'complete';
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface OperatorStatus {
  id: string;
  user_id: string;
  show_id: string;
  current_cue_id?: string;
  is_ready: boolean;
  private_notes?: string;
  last_ping?: string;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  show_id: string;
  message: string;
  sent_by: string;
  is_emergency: boolean;
  created_at: string;
}

export interface CueNote {
  id: string;
  cue_id: string;
  user_id: string;
  note: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}
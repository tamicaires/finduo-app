export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  has_couple: boolean;
  couple_id?: string;
  partner_name?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  reason?: string;
}

export interface UpdateEmailData {
  userId: string;
  newEmail: string;
  reason?: string;
}

export interface LinkCoupleData {
  user_id_a: string;
  user_id_b: string;
  reason?: string;
}

export interface UnlinkCoupleData {
  coupleId: string;
  reason?: string;
}

export interface AssignPlanData {
  couple_id: string;
  plan_name: 'FREE' | 'PREMIUM' | 'UNLIMITED';
  duration_days?: number;
  reason?: string;
}

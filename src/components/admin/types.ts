export interface Teacher {
  id?: number;
  name: string;
  photo_url?: string;
  description?: string;
  specialization?: string;
  experience?: string;
  sort_order?: number;
}

export interface Schedule {
  id?: number;
  time: string;
  title: string;
  description?: string;
  teacher_id?: number;
  sort_order?: number;
}

export interface Contact {
  id?: number;
  type: string;
  value: string;
  icon?: string;
  label?: string;
  sort_order?: number;
}

export interface Review {
  id?: number;
  author_name: string;
  author_photo?: string;
  rating?: number;
  review_text: string;
  date?: string;
  is_published?: boolean;
  sort_order?: number;
}

export interface Booking {
  id?: number;
  student_name: string;
  student_phone: string;
  student_email?: string;
  selected_teacher?: string;
  selected_subject?: string;
  selected_time?: string;
  status?: string;
  created_at?: string;
}

export interface NotificationSetting {
  id?: number;
  notification_type: string;
  is_enabled: boolean;
  value: string;
}
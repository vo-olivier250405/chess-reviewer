export interface Notification {
  id: string;
  is_read: boolean;
  object_type: string | null;
  object_id: string | null;
  title: string;
  message: string;
  redirection: { url?: string; label?: string } | null;
  created_at: string;
}

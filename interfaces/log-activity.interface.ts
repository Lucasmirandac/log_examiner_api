export interface LogActivity {
  user_id: string;
  action: string;
  timestamp: string;
  metadata: {
    page: string;
    duration: number;
    query: string;
    file_type: string;
  };
}

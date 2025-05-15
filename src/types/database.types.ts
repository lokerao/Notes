export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          created_at: string;
          content: string;
          user_id: string;
          title: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content: string;
          user_id: string;
          title: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          content?: string;
          user_id?: string;
          title?: string;
        };
      };
    };
  };
}

export type Note = Database['public']['Tables']['notes']['Row'];
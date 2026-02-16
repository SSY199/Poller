export interface Poll {
  id: string;
  question: string;
  created_at: string;
}

export interface Option {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

// FIXED: Renamed ip_address to ip_hash
export interface PollVote {
  id: string;
  poll_id: string;
  ip_hash: string;
  created_at: string;
}
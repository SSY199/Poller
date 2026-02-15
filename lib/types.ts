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
export interface PollVote {
  id: string;
  poll_id: string;
  ip_address: string;
  created_at: string;
}
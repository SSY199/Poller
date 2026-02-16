"use client";

import { useEffect, useState } from "react";
import { Poll, Option } from "@/lib/types";
import VoteInterface from "./VoteInterface"; 
import LiveResults from "./LiveResults";
import ShareLink from "./ShareLink";    

interface PollUIProps {
  poll: Poll;
  initialOptions: Option[];
}

export default function PollUI({ poll, initialOptions }: PollUIProps) {
  const [hasVoted, setHasVoted] = useState(false);

  // Fairness Mechanism #1: Check LocalStorage on mount
  useEffect(() => {
    const localVote = localStorage.getItem(`poll_voted_${poll.id}`);
    if (localVote) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasVoted(true);
    }
  }, [poll.id]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{poll.question}</h1>
      
      {/* Switch between Vote and Results based on status */}
      {hasVoted ? (
        <LiveResults pollId={poll.id} initialOptions={initialOptions} />
      ) : (
        <VoteInterface 
          poll={poll} 
          options={initialOptions} 
          onVoteSuccess={() => setHasVoted(true)} 
        />
      )}

      {/* Always show the share link at the bottom */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <ShareLink />
      </div>
    </div>
  );
}
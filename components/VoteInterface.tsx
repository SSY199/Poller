"use client";

import { useState } from "react";
import { Poll, Option } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoteInterfaceProps {
  poll: Poll;
  options: Option[];
  onVoteSuccess: () => void;
}

export default function VoteInterface({
  poll,
  options,
  onVoteSuccess,
}: VoteInterfaceProps) {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (optionId: string) => {
    setIsVoting(true);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to vote");
      }

      localStorage.setItem(`poll_voted_${poll.id}`, "true");

      toast.success("Vote Successful! Thank you for voting.");

      onVoteSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Vote Failed. Something went wrong.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Simple Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-800">
          Make your choice
        </h2>
        <p className="text-sm text-slate-500 mt-1">Select an option below</p>
      </div>

      <div className="grid gap-3">
        {options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={isVoting}
            variant="outline"
            className="w-full py-6 text-lg justify-start px-6 hover:bg-slate-50 border-slate-200"
          >
            {option.option_text}
          </Button>
        ))}
      </div>

      <p className="text-xs text-center text-slate-400">
        Results update in real-time.
      </p>
    </div>
  );
}

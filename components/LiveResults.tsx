"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Option } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

interface LiveResultsProps {
  pollId: string;
  initialOptions: Option[];
}

export default function LiveResults({
  pollId,
  initialOptions,
}: LiveResultsProps) {
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const totalVotes = options.reduce((acc, curr) => acc + curr.vote_count, 0);

  useEffect(() => {
    const channel = supabase
      .channel(`real-time-votes-${pollId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "options",
          filter: `poll_id=eq.${pollId}`,
        },
        (payload) => {
          const updatedOption = payload.new as Option;
          setOptions((current) =>
            current.map((opt) =>
              opt.id === updatedOption.id ? updatedOption : opt,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);
  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-semibold text-center text-slate-800 mb-4">
        Live Results
      </h2>

      {options.map((option) => {
        const percentage =
          totalVotes === 0
            ? 0
            : Math.round((option.vote_count / totalVotes) * 100);
        return (
          <div key={option.id} className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>{option.option_text}</span>
              <span className="text-slate-500">{percentage}%</span>
            </div>
            {/* Shadcn Progress Component */}
            <Progress value={percentage} className="h-3" />
          </div>
        );
      })}

      <div className="text-center pt-4 text-xs text-slate-400">
        Total votes: {totalVotes}
      </div>
    </div>
  );
}

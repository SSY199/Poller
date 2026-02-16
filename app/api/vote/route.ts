import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto"; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pollId, optionId } = body;

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    const { data: existingVote } = await supabase
      .from("poll_votes")
      .select("id")
      .eq("poll_id", pollId)
      .eq("ip_hash", ipHash) 
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this poll." },
        { status: 403 }
      );
    }

    const { error: voteError } = await supabase
      .from("poll_votes")
      .insert([{ poll_id: pollId, ip_hash: ipHash }]);

    if (voteError) throw voteError;

    const { error: incrementError } = await supabase.rpc('increment_vote', { row_id: optionId });
    
    if (incrementError) {
        const { data: option } = await supabase.from('options').select('vote_count').eq('id', optionId).single();
        const newCount = (option?.vote_count || 0) + 1;
        await supabase.from('options').update({ vote_count: newCount }).eq('id', optionId);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
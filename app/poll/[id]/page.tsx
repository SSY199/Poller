// app/poll/[id]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import PollUI from "@/components/PollUI";
import { notFound } from "next/navigation";

// Force dynamic rendering so we always get fresh data
export const dynamic = 'force-dynamic';

export default async function PollPage({ params }: { params: { id: string } }) {
  // 1. Fetch the Poll
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("*")
    .eq("id", params.id)
    .single();

  if (pollError || !poll) {
    notFound(); // Shows the 404 page if poll doesn't exist
  }

  // 2. Fetch the Options
  const { data: options, error: optionsError } = await supabase
    .from("options")
    .select("*")
    .eq("poll_id", params.id)
    .order("vote_count", { ascending: false }); // Sort by most votes initially

  if (optionsError) {
    console.error("Error fetching options:", optionsError);
  }

  // 3. Render the Client Component
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <PollUI poll={poll} initialOptions={options || []} />
    </main>
  );
}